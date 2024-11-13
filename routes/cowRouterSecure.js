const express = require('express')
const cowRouterSecure = express.Router()
const Cow = require('../models/cow')
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

// Upload image to S3 and create a new cow entry
cowRouterSecure.post('/', upload.single('image'), async (req, res, next) => {
    try {
        const s3Params = {
            Bucket: s3BucketName,
            Key: `cows/${req.file.originalname}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        }
        const command = new PutObjectCommand(s3Params)
        await S3.send(command)
        const fileLocation = `https://${s3BucketName}.s3.${awsRegion}.amazonaws.com/cows/${req.file.originalname}`
        const newCowData = {
            ...req.body,
            image: fileLocation,
        }
        const newCow = new Cow(newCowData)
        const savedCow = await newCow.save()
        res.status(201).send(savedCow)
    } catch (err) {
        res.status(500)
        return next(err)
    }
});

// Delete a cow by ID and remove the image from S3
cowRouterSecure.delete('/:cowID', async (req, res, next) => {
    try {
        const cow = await Cow.findById(req.params.cowID)
        if (!cow) {
            return res.status(404).send('Cow not found')
        }
        if (cow.image) {
            const imageUrl = cow.image
            const imageKey = imageUrl.substring(imageUrl.indexOf('cows/'))
            const deleteParams = {
                Bucket: s3BucketName,
                Key: imageKey,
            }
            const deleteCommand = new DeleteObjectCommand(deleteParams)
            await S3.send(deleteCommand)
        }
        const deletedCow = await Cow.findByIdAndDelete(req.params.cowID)
        res.status(200).send(`Successfully deleted ${deletedCow.name} and its image from the database and S3.`)
    } catch (err) {
        res.status(500)
        return next(err)
    }
})

// Update cow data along with an image
cowRouterSecure.put('/:cowID', upload.single('image'), async (req, res, next) => {
    try {
        let updatedCowData = { ...req.body }
        const cow = await Cow.findById(req.params.horseID)
        if (!cow) {
            return res.status(404).send('Cow not found')
        }
        if (req.file) {
            if (cow.image) {
                const oldImageKey = cow.image.substring(cow.image.indexOf('cows/'))
                const deleteParams = {
                    Bucket: s3BucketName,
                    Key: oldImageKey,
                }
                const deleteCommand = new DeleteObjectCommand(deleteParams)
                await S3.send(deleteCommand)
            }
            const s3Params = {
                Bucket: s3BucketName,
                Key: `cows/${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            }
            const uploadCommand = new PutObjectCommand(s3Params)
            await S3.send(uploadCommand)
            const newFileLocation = `https://${s3BucketName}.s3.${awsRegion}.amazonaws.com/cows/${req.file.originalname}`
            updatedCowData.image = newFileLocation
        }
        const updatedCow = await Cow.findByIdAndUpdate(req.params.cowID, updatedCowData, { new: true })
        res.status(200).send(updatedCow)

    } catch (err) {
        res.status(500)
        return next(err)
    }
})

module.exports = cowRouterSecure