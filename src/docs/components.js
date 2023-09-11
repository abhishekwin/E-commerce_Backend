module.exports = {
    components: {
      schemas: {
        // id model
        id: {
          type: "string", // data type
          description: "An id of a todo", // desc
          example: "tyVgf", // example of an id
        },
        // RegsiterUser input model
        RegsiterUser: {
          type: "object", // data type
          properties: {
            username: {
              type: "string", // data type
              description: "user name", // desc
              example: "user1", // example of a title
            },
            email: {
                type: "string", // data type
                description: "user's email id", // desc
                example: "user1@gmail.com", // example of a title
              },
              password: {
                type: "string", // data type
                description: "user's password", // desc
                example: "user1%!&@*!$", // example of a title
              },
              role: {
                type: "string", // data type
                description: "Set user Role ", // desc
                example: "User", // example : {User,Admin, Seller}
              }
          },
        },
        LoginUser: {
          type: "object", // data type
          properties: {
            email: {
                type: "string", // data type
                description: "user's email id", // desc
                example: "user1@gmail.com", // example of a title
              },
              password: {
                type: "string", // data type
                description: "user's password", // desc
                example: "user1%!&@*!$", // example of a title
              }
          },
        },
        // error model
        Error: {
          type: "object", //data type
          properties: {
            message: {
              type: "string", // data type
              description: "Error message", // desc
              example: "Not found", // example of an error message
            },
            internal_code: {
              type: "string", // data type
              description: "Error internal code", // desc
              example: "Invalid parameters", // example of an error internal code
            },
          },
        },
      },
    },
  };