# Корректариум [ F | B ]

Корректариум [[https://correctarium.com/](https://correctarium.com/)] — бюро корректуры для которого мы делали REACT- приложение для пользователей, админку для админов и бэкенд. Это реальный проект и хорошая возможность опробовать себя в качестве бэкенд-разработчика.

В задании надо написать **алгоритм расчета стоимости**, времени выполнения и даты сдачи (дедлайна). Как это выглядит и как оно работает — вы можете посмотреть на сайте проекта (линк выше). Ниже приводим исходные бизнес требования, которые объявил клиент.

### **Часть #1**
Исходные бизнес требования:

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/aa3fe82c-5ec4-4ead-97b9-a7e2335070af/photo_2021-06-02_20.18.31.jpeg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/aa3fe82c-5ec4-4ead-97b9-a7e2335070af/photo_2021-06-02_20.18.31.jpeg)

<aside>
💡 **FAQ
Надо ли делать загрузку файлов и вычитку из них текста?**
Нит, просто передайте в функцию подсчета условный enum [none, doc, docx, rtf...]

**Мой результат не совсем совпадает с тем что на сайте**
Все ок, он и не должен, на сайте уже другая формула.

**Для бэкенда:** вы готовите функции подсчёта стоимости и дедлайна без рюшечек и украшательств.

</aside>

### **Часть #2.1**

После написания алгоритма (он вроде не особо сложный) надо хорошенько все проверить, пушо мы сами когда писали проект несколько раз релизили и вылазили баги. Например, подавали заказ в 7 вечера в воскресенье и дедлайн был 11 вечера воскресенья, заказчики были не довольны и пока мы не покрыли все тестами не получалось все починить.

Лонг стори шорт - в этой части задания мы покрываем алгоритм тестами с помощью [JestJs](https://jestjs.io).

**НЕ ЧИТАЙТЕ ДО того как покрыли тестами,** 
Cломайте бизнес логику, сделайте чтобы она считала неправильно и посмотрите сломается ли ваш тест.

Посмотрите покрыли ли вы все граничные кейсы 

**Часть #2.2 [Фронтендщикам]**
Сверстайте страницу как тут [https://correctarium.com/make-order](https://correctarium.com/make-order) на React, важно чтобы тесты бизнес логики лежали бок о бок в проекте и можно было запустить `npm run test` проверить все и потом с `npm start` запустить приложение.
На этом этапе даже можно залить эту страничку уже на [Vercel](https://vercel.com) или [Netlify](https://www.netlify.com) или [Heroku](https://heroku.com)
****

**Часть #2.2 [Бэкендщикам]**
Написать серверное приложение на ExpressJs, REST API в которое можно отправить исходные данные в формате json

```jsx
{
	"language": "en",
	"mimetype": "none|doc|docx|rtf|other" //other для мультиплаера цены 1.2
	"count": 10_000
}
```

и АПИ в свою очередь ответит

```jsx
{
	"price": 100.0 //деньги
	"time": 1 //часы,
	"deadline": 1623822732 //UNIX таймстемп в секундах
	"deadline_date": "10/10/2021 12:00:00"
}
```

важно чтобы тесты бизнес логики лежали бок о бок в проекте и можно было запустить `npm run test` проверить все и потом с `npm start` запустить приложение.