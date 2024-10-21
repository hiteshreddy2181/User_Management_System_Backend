import oracledb from 'oracledb';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import connect from '../config/database.js'


export const getUserDetails = async (req, res) => {
    try {
        const connection = await connect();
        const role = req.user.role; // Assuming you have the user's role set in req.user

        let user;
        if (role) {
            const result = await connection.execute(
                `SELECT * FROM users WHERE username = :username`,
                { username: req.user.username },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            user = result.rows[0];
        }

        await connection.close();

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            res.status(401).send("Token expired");
        } else {
            res.status(500).send("Internal Server Error");
        }
    }
}

export const studentLogin = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Check if username, password, and role are provided
        if (!(username && password && role)) {
            return res.status(400).send("username, password, and role are required");
        }

        const connection = await connect();

        // Find user by username
        const userResult = await connection.execute(
            `SELECT * FROM users WHERE username = :username`,
            { username },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        const user = userResult.rows[0];
        console.log(password)
        console.log(user.PASSWORD)
        console.log(user);  // Debug: check if user object contains the password

        if (!user || !user.PASSWORD) {
            return res.status(400).send("Invalid credentials");
        }

        // const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword)
        // If password matches
        const password_match=await bcrypt.compare(password, user.PASSWORD)
        console.log(password_match)
        if (password_match) {
            let responseRole;
            console.log("i AM HERE ALREADY")
            // Check for the role in the database
            if (user.ROLE === 'studentadmin') {
                responseRole = role;  // Return the role received in the request
            } else if (user.ROLE === 'student') {
                responseRole = 'student';  // Return 'student'
            } else if (user.ROLE === 'admin') {
                responseRole = 'admin';  // Return 'admin'
            } else {
                return res.status(403).send("Unauthorized role");
            }

            // Generate token
            const token = Jwt.sign(
                {username, role: responseRole },  // Use the role for the response
                process.env.TOKEN, // Ensure TOKEN is set in your environment
                {
                    expiresIn: "1h"
                }
            );

            // Add token to the user object and send response
            user.token = token;
            return res.status(200).json({ ...user, role: responseRole });  // Send the role in the response
        }

        // If credentials are invalid
        res.status(400).send("Invalid credentials or role mismatch");
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred");
    }
};

export const addStudent = async (req, res) => {
    try {
        const {
            firstname,
            lastName,
            username,
            password,
            role,               // Include role in the request
            startDate,         // Include startDate in the request
            dateOfAdmission    // Include dateOfAdmission in the request
        } = req.body;

        const connection = await connect();

        const studentResult = await connection.execute(
            `SELECT * FROM users WHERE username = :username`,
            { username }
        );

        if (studentResult.rows.length > 0) {
            return res.status(404).json({ message: 'User name already exists' });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        await connection.execute(
            `INSERT INTO users (firstname, lastName, username, password, role, startDate, dateOfAdmission) VALUES (:firstname, :lastName, :username, :password, :role, :startDate, :dateOfAdmission)`,
            {
                firstname,
                lastName,
                username,
                password: encryptedPassword,
                role: role || 'student', // Default to 'student' if not provided
                startDate,
                dateOfAdmission
            },
            { autoCommit: true }
        );

        res.status(201).json({ message: 'Student added successfully' });
    } catch (error) {
        console.error('Error while adding student:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getStudents = async (req, res) => {
    try {
        const connection = await connect();

        const result = await connection.execute(
            `SELECT firstname, lastName, username, role, startDate, dateOfAdmission FROM users WHERE role = :role`,
            { role: 'student' },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        await connection.close();

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).send(error);
    }
}

export const UpdateStudent = async (req, res) => {
    try {
        const { username } = req.params;

        const connection = await connect();
        
        const studentResult = await connection.execute(
            `SELECT * FROM users WHERE username = :username`,
            { username }
        );

        const student = studentResult.rows[0];
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const updatedData = req.body;

        await connection.execute(
            `UPDATE users SET firstname = :firstname, lastName = :lastName, role = :role, startDate = :startDate, dateOfAdmission = :dateOfAdmission WHERE username = :username`,
            {
                ...updatedData,
                username
            },
            { autoCommit: true }
        );

        res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error('Error while updating student:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const DeleteStudent = async (req, res) => {
    try {
        const { username } = req.params;

        const connection = await connect();

        // Find the student by username and delete it
        const deleteResult = await connection.execute(
            `DELETE FROM users WHERE username = :username`,
            { username },
            { autoCommit: true }
        );

        if (deleteResult.rowsAffected === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
