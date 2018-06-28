# nginx+certbot

## About

This project is a docker container that contains:
* nginx
* certbot
* app that provides an API to manage both nginx and certbot

### The app

It is written in Javascript, with NodeJS, and it provides a REST API that allows clients to manage nginx and certbot.

To manage nginx, the commands are issues using the [ShellJS][shelljs] lib and the output is sent back to the client in the response. There is an nginx module ([ngx_http_api_module][ngx_http_api_module]) that would make this a lot simpler, but it is only available in nginx+, that requires paid license.

#### App API

The API description can be found here: [nginxcertbot.docs.apiary.io][apiary_nginxcertbot]

## Contributing

If you want to contribute, feel free to open issues or send pull requests.

There are some standards to follow. They are not written in stone, but they are very much appreciated.

### Coding style

- 2 spaces, no tabs
- max chars per line: 100
- No trailing white spaces

### Commit message style


Read this: [https://github.com/trein/dev-best-practices/wiki/Git-Commit-Best-Practices#formatting-rules][2]

[shelljs]: http://shelljs.org
[ngx_http_api_module]: http://nginx.org/en/docs/http/ngx_http_api_module.html
[commit_style]: https://github.com/trein/dev-best-practices/wiki/Git-Commit-Best-Practices#formatting-rules
[apiary_nginxcertbot]: https://nginxcertbot.docs.apiary.io/