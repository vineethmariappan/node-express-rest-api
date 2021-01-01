'use strict'

const e = require('express');
const firebase = require('../db');
const Student = require('../models/student');
const firestore = firebase.firestore();

const addStudent = async (req,res,next) =>{
    try{
        const data = req.body;
        // console.log(data);
        await firestore.collection('students').doc().set(data);
        res.send('Record saved successfully');
    }
    catch(error){
        res.status(400).send(error.message);
    }
}

const getAllStudents = async (req,res,next) =>{
    const studentsArray=[];
    try{
        const students = await firestore.collection('students');
        const docs = await students.get();
        if(docs.empty){
            res.status(404).send("No student record");
        }
        else{
            docs.forEach(doc =>{
                const student = new Student(
                    doc.id,
                    doc.data().firstName,
                    doc.data().lastName,
                    doc.data().fatherName,
                    doc.data().classEnrolled,
                    doc.data().age,
                    doc.data().phoneNumber,
                    doc.data().subject,
                    doc.data().year,
                    doc.data().semester,
                    doc.data().status
                );
                studentsArray.push(student);
            });
            res.send(studentsArray);
        }
    }
    catch(error){
        res.status(400).send(error.message);
    }
}

const getStudent = async (req, res, next) =>{
    try {
        const id = req.params.id;
        const student = await firestore.collection('students').doc(id);
        const doc = await student.get();
        if(!doc.exists){
            res.status(404).send("student doest exist");
        }
        else{
            res.send(doc.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateStudent = async (req,res,next)=>{
    try {
        const id = req.params.id;
        const data = req.body;
        const student = await firestore.collection('students').doc(id);
        await student.update(data);
        res.send("Student record updated successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteStudent = async(req,res,next) =>{
    try {
        const id = req.params.id;
        await firestore.collection('students').doc(id).delete();
        res.send("Student record deleted successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addStudent,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent
}