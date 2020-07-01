### How to reference a dir for interceptors

Its is important to note that you can only have depth of one directory
 inside the plugins

*All .js file in subdirectory must export a function as defaults* 

```yaml
.......
  get:
    name: "resource name"
    http:
      endpoint: "http://endpoint"
      method: get
      request_interceptor:
        _dir:
          - example
```