# Your root application

The `src/` folder is the base folder for your project. This is where you will work.

Please consider this folder as the root of your application.

The advantage of considering the `src` folder as the base of your application is that you can structure it as you see fit.


It can be interesting to look at design patterns, here are some of them :

- [Monolithic Architecture vs Microservice](https://23o0161033pm1289qo1hzrwi-wpengine.netdna-ssl.com/wp-content/uploads/2020/12/monolithic-and-microservices-architecture.jpg.webp)
- [NodeTSkeleton, a clean architecture](https://dev.to/vickodev/nodetskeleton-clean-arquitecture-template-project-for-nodejs-gge)
- [Hexagonal Architecture](https://blog.octo.com/architecture-hexagonale-trois-principes-et-un-exemple-dimplementation/)

Please use the `factory make:file` command to create a file quickly

### Import with alias
To simplify the import of your files, the alias `App/` is available. This alias refers to the root folder `src/`.

Example:
```ts
- import Foo from '../../../Foo'
+ import Foo from 'App/Folder/Foo'
```

