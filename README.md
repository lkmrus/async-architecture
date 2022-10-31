### Async architecture

## Schema
[Link to the public schema](https://miro.com/app/board/uXjVPTOySAY=/?share_link_id=751479224495)

## Services
- [SSO](./sso/README.md "more here")
- [Task Tracker](./task-tracker/README.md "more here")
- [Accounting](./accounting/README.md "more here")
- [Event Schema Registry Library](./schema-registry/README.md "more here")


### TODO:
- Доделать АПИ и Крон аккаунтинг сервиса
- Доработать отправку несколько версий ивентов и их валидацию
- Добавить events log для трассировки
- Transaction outbox для консистентности и оркестрации событий
- На примере task-tracker сервисе применить CQRS паттерн
- Сделать простой фронт на Вью или Астро
- Event sourcing - проработать работу со стейтом ивентов (паттерн State)
- Сделать Сагу без оркестратора с компенсацией
