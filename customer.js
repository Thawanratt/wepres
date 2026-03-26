const BASE_URL = 'http://localhost:8080';  // URL ของ API ที่ให้บริการข้อมูลการจองโต๊ะ (restaurant)
window.onload = async () => {
    await loadData();
};

const loadData = async () => {
    console.log('Restaurant page loaded');
    
        //โหลดข้อมูลร้านอาหารทั้งหมดจาก API
        const response = await axios.get(`${BASE_URL}/restaurant`);
        console.log(response.data);  // ตรวจสอบข้อมูลที่ได้จาก API

        const restaurantDOM = document.getElementById('restaurant');

        let htmlData ='<table>';
        for (let i = 0; i < response.data.length; i++) {
            let restaurant = response.data[i]; 
            htmlData += `<tr>
                <td>${restaurant.id}</td>
                <td>${restaurant.table_id}</td>
                <td>${restaurant.customer_name}</td>
                <td>${new Date(restaurant.date).toISOString().split("T")[0]}</td>
                <td>${restaurant.time}</td>
                <td>${restaurant.tel}</td>
                <td class="actions">
                    <a href='form.html?id=${restaurant.id}'><button class="btn-edit">Edit</button></a>
                    <button class="btn-delete" data-id='${restaurant.id}'>Delete</button>
                </td>
            </tr>`;
        }
        htmlData += '</table>';
        restaurantDOM.innerHTML = htmlData;

        //เพิ่ม Event Listener สำหรับลบการจอง
        const deleteButtons = document.getElementsByClassName('btn-delete');
        for (let button of deleteButtons) {
            button.addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                try {
                    await axios.delete(`${BASE_URL}/restaurant/${id}`);
                    loadData();  // recursive function=เรียกใช้ฟังก์ตัวเอง
                } catch (error) {
                    console.error('Error deleting restaurant booking:', error);
                    alert("ไม่สามารถลบการจองได้");
                }
            });
        }
    }
        // เพิ่ม Event Listener สำหรับการแก้ไขการจอง
        const editButtons = document.getElementsByClassName('btn-edit');
        for (let button of editButtons) {
            button.addEventListener('click', (event) => {
                const id = event.target.dataset.id;
                window.location.href = `edit.html?id=${id}`;  // ไปที่หน้าแก้ไขการจอง
            });
        }
    


