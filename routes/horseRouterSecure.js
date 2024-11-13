const express = require('express')
const horseRouterSecure = express.Router()
const Horse = require('../models/horse')
const multer = require('multer')
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const path = require('path')

// Set up memory storage for multer
const storage = multer.memoryStorage()
const upload = multer({ storage })

// AWS S3 Configuration
const awsAccessKey = process.env.AWS_ACCESS_KEY_ID
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const awsRegion = process.env.AWS_REGION
const s3BucketName = process.env.S3_BUCKET_NAME

const S3 = new S3Client({
    credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretAccessKey,
    },
    region: awsRegion,
})

// Upload image to S3 and create a new horse entry
horseRouterSecure.post('/', upload.single('image'), async (req, res, next) => {
    try {
        const s3Params = {
            Bucket: s3BucketName,
            Key: `horses/${req.file.originalname}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        }
        const command = new PutObjectCommand(s3Params)
        await S3.send(command)
        const fileLocation = `https://${s3BucketName}.s3.${awsRegion}.amazonaws.com/horses/${req.file.originalname}`
        const newHorseData = {
            ...req.body,
            image: fileLocation,
        }
        const newHorse = new Horse(newHorseData)
        const savedHorse = await newHorse.save()
        res.status(201).send(savedHorse)
    } catch (err) {
        res.status(500)
        return next(err)
    }
});

// Delete a horse by ID and remove the image from S3
horseRouterSecure.delete('/:horseID', async (req, res, next) => {
    try {
        const horse = await Horse.findById(req.params.horseID)
        if (!horse) {
            return res.status(404).send('Horse not found')
        }
        if (horse.image) {
            const imageUrl = horse.image
            const imageKey = imageUrl.substring(imageUrl.indexOf('horses/'))
            const deleteParams = {
                Bucket: s3BucketName,
                Key: imageKey,
            }
            const deleteCommand = new DeleteObjectCommand(deleteParams)
            await S3.send(deleteCommand)
        }
        const deletedHorse = await Horse.findByIdAndDelete(req.params.horseID)
        res.status(200).send(`Successfully deleted ${deletedHorse.name} and its image from the database and S3.`)
    } catch (err) {
        res.status(500)
        return next(err)
    }
})

// Update horse data along with an image
horseRouterSecure.put('/:horseID', upload.single('image'), async (req, res, next) => {
    try {
        let updatedHorseData = { ...req.body }
        const horse = await Horse.findById(req.params.horseID)
        if (!horse) {
            return res.status(404).send('Horse not found')
        }
        if (req.file) {
            if (horse.image) {
                const oldImageKey = horse.image.substring(horse.image.indexOf('horses/'))
                const deleteParams = {
                    Bucket: s3BucketName,
                    Key: oldImageKey,
                }
                const deleteCommand = new DeleteObjectCommand(deleteParams)
                await S3.send(deleteCommand)
            }
            const s3Params = {
                Bucket: s3BucketName,
                Key: `horses/${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            }
            const uploadCommand = new PutObjectCommand(s3Params)
            await S3.send(uploadCommand)
            const newFileLocation = `https://${s3BucketName}.s3.${awsRegion}.amazonaws.com/horses/${req.file.originalname}`
            updatedHorseData.image = newFileLocation
        }
        const updatedHorse = await Horse.findByIdAndUpdate(req.params.horseID, updatedHorseData, { new: true })
        res.status(200).send(updatedHorse)

    } catch (err) {
        res.status(500)
        return next(err)
    }
})

module.exports = horseRouterSecure