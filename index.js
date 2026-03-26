const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

const port = 8080;  
app.use(bodyParser.json());
app.use(cors());

let conn = null;

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',  
        user: 'root',
        password: 'root',
        database: 'restaurantdb',
        port: 9906   // ใช้พอร์ตที่คุณแมปไว้ใน docker-compose.yml
    })
}
const validateData = (restaurantData) => {
    let errors = [];
    if (!restaurantData.customer_name) {
        errors.push('กรุณากรอกชื่อ');
    }
    if (!restaurantData.table_id) {
        errors.push('กรุณากรอกหมายเลขโต๊ะ');
    }
    if (!restaurantData.date) {
        errors.push('กรุณากรอกวันที่');
    }
    if (!restaurantData.time) {
        errors.push('กรุณากรอกเวลา');
    }
    if (!restaurantData.tel) {
        errors.push('กรุณากรอกหมายเลขโทรศัพท์');
    }
    return errors;
};
app.get("/restaurant", async (req, res) => {
    const result = await conn.query("SELECT * FROM restaurant");
    res.json(result[0]);
})

app.post("/restaurant", async (req, res) => {
    try {
        let restaurant = req.body;
        const errors = validateData(restaurant)
        if (errors.lenght > 0 ) {
        throw {
            message:'กรุณากรอกข้อมูลให้ครบถ้วน',
         error: errors
    }
}
const results = await conn.query("INSERT INTO restaurant SET ?",restaurant);
res.json({
    message: 'Create user successfully',
      data: results[0]
})
} catch (error) {
    const errorMessage = error.message || 'something went wrong'
    const errors = error.errors || []
    console.log('error message:', error.message)
    res.status(500).json({
      message: errorMessage,
      errors:errors
     })
  }
})
app.get("/restaurant/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const results = await conn.query("SELECT * FROM restaurant WHERE id = ?", id);
        if (results[0].length === 0) {
            throw { statusCode: 404, message: 'user not found' }
   } 
   res.json(results[0][0])
  } catch (error) {
    console.error('error', error.message)
    let statusCode = error.statusCode || 500
    res.status(500).json({
      message: 'something went wrong',
      errorMessage: error.message  
    })
  }
})
app.put("/restaurant/:id", async (req, res) => {
    try{
        let id= req.params.id;
        let updatedRestaurant = req.body;
        const results = await conn.query("UPDATE restaurant SET ? WHERE id = ?", [updatedRestaurant, id]);
        res.json({
            message: 'Update user successfully',
            data: results[0]
        })
    }catch (error) {
        console.log('error message:', error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
    }
})

app.delete("/restaurant/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const results = await conn.query("DELETE FROM restaurant WHERE id = ?", id);
        res.json({
            message: 'Delete user successfully',
            data: results[0]
        })
    } catch (error) {
        console.log('error message:', error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
    }
});

app.listen(port, async () => {
    await initMySQL();
    console.log('Http Server is running on port'+ port);
});