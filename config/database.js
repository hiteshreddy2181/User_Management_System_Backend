import oracledb from "oracledb";

// OracleDB connection configuration
const config = {
    user: "system",
    password: "123456",
    connectString: "//localhost:1521/xepdb1", // Example: "localhost:1521/xepdb1"
};

    
const connect = async () => {
    try {
        // Initialize OracleDB connection pool
        const connection = await oracledb.getConnection(config);
        console.log("Successfully connected to the Oracle database");   

        // const result = await connection.execute("select * from users");
        // console.log(result.rows);

        // You can perform database operations here
        // Example: const result = await connection.execute("SELECT * FROM your_table");

        // Close the connection when done
        //await connection.close();
        return connection;
    } catch (error) {
        console.error("Database connection failed, exiting now...");
        console.error(error);
        process.exit(1);
    }
};

export default connect;
