import RecruiterAuth from "../models/recruiterAuth.js"
import Jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
const TOKEN = "Arun@123";

export const recruiterRegister = async (req, res) => {
    try {
        const {name, mobile, email, password, role} = req.body;
        if(!(email && password && name && mobile, role)) {
            res.status(400).send("details are required");
        }

        const oldUser = await RecruiterAuth.findOne({email});
        if(oldUser) {
            return res.status(409).send("User already exist. please login");
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await RecruiterAuth.create({
            name,
            mobile,
            role,
            email: email.toLowerCase(),
            password: encryptedPassword,
            userid: uuidv4(),
            
        })
        

        const token = Jwt.sign(
            { user_id: user._id, email },
            TOKEN,
            { expiresIn: "1h"}
        );

        user.token = token;
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
    }
}

export const recruiterLogin = async (req, res) => {
    try{
        const { email, password, role } = req.body;

        if(!(email && password && role)) {
            res.status(400).send("email and password and role is required");
        }

        const user = await RecruiterAuth.findOne({email});

        if(user && (await bcrypt.compare(password, user.password))) {
            const token = Jwt.sign(
                { user_id: user._id, email, role: user.role },
                TOKEN,
                {
                    expiresIn: "1h"
                }
            )

            user.token = token;
            res.status(200).json(user);
        }
        res.status(400).send("Invalid credentials");
    } catch (error) {
        console.log(error);
    }
}