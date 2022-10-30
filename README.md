### Async architecture

## Schema
[Link to the public schema](https://miro.com/app/board/uXjVPTOySAY=/?share_link_id=751479224495)

## Services
- [SSO](./sso/README.md "more here")
- [Task Tracker](./task-tracker/README.md "more here")
- [Accounting](./accounting/README.md "more here")
- [Event Schema Registry Library](./schema-registry/README.md "more here")

### TODO:
- Доделать аккаунтинг
- Доработать отправку несколько версий ивентов и их валидацию
- Добавить events log для трассировки
- Transaction outbox для консистенции и оркестрации событий батчем
- На примере task-tracker сервисе применить CQRS паттерн 
- Сделать простой фронт на вью или Астро
- event sourcing - проработать работу со стейтом ивентов (паттерн Стейт)
- Сделать Сагу без оркестратора с компенсацией
