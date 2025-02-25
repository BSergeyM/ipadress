"use strict";
//Створити просту HTML-сторінку з кнопкою Знайти по IP.
// Натиснувши кнопку - надіслати AJAX запит за адресою https://api.ipify.org/?format=json, отримати звідти IP адресу клієнта.
// Дізнавшись IP адресу, надіслати запит на сервіс https://ip-api.com/ та отримати інформацію про фізичну адресу.
// під кнопкою вивести на сторінку інформацію, отриману з останнього запиту – континент, країна, регіон, місто, район.
// Усі запити на сервер необхідно виконати за допомогою async await.
const btn = document.querySelector(".btn");

class ipUser {
  constructor({ timezone, country, city, regionName }) {
    this.timezone = timezone;
    this.country = country;
    this.city = city;
    this.regionName = regionName;
    this.root = document.createElement("div");
  }

  render() {
    this.root.classList.add("card");
    this.root.insertAdjacentHTML(
      "beforeend",
      `
                <ul>
                    <li>Континент: ${this.timezone}</li>
                    <li>Країна: ${this.country}</li>
                    <li>Регіон: ${this.city}</li>
                    <li>Район: ${this.regionName}</li>
                </ul>
            `
    );
    document.getElementById("result").appendChild(this.root);
  }

  remove() {
    this.root.remove();
  }
}

let user;
btn.addEventListener("click", () => {
  if (user) {
    user.remove();
  }
  sendIp();
});

const sendIp = async () => {
  try {
    const response = await fetch("https://api.ipify.org/?format=json");
    console.log(response);
    const data = await response.json();
    console.log(data);
    const ipAddress = data.ip;
    const sendToServer = await fetch(`http://ip-api.com/json/${ipAddress}`);
    const locationData = await sendToServer.json();
    console.log(locationData);

    if (locationData.status === "fail") {
      throw new Error("Помилка при отриманні даних з ip-api");
    }

    user = new ipUser(locationData);
    user.render();
    console.log("IP-адреса успішно відправлена на сервер");
  } catch (err) {
    console.error(err);
  }
};
