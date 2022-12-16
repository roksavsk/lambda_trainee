# Авторизация [Backend]

```jsx
POST /sign_up 
body json:
email: «email»
password: «password»
____
POST /login?email=<email>&password=<password>
____
GET /me[0-9]
хедеры:
Authorization: Bearer <access_token>
___
POST /refresh
хедеры:
Authorization: Bearer <refresh_token>
```

Написать REST API на базе ExpressJs для регистрации/логина на базе JWT токенов.
`sign_up` регистрирует пользователя
`login` логинит и выдает токен доступа с TTL (time to live) от 30 до 60 секунд(рандомно)
`refresh` перевыпускает новый токен доступа
`me[0-9]` отдает mock данные пользователя и отдельным полем номер запроса
если токен заэкспайрился(вышло время его TTL) отвечаем 401 Unauthorised

```jsx
GET /me1
{
	"request_num": 1,
	"data": {
		"username": "login из токена пользователя"
	}
}
```

Для хранения данных пользователя используем MongoDB, голый драйвер без Mongoose