module.exports = {
    // operation's method
    post: {
      tags: ["Users"], // operation's tag
      description: "Create Users", // short desc
      summary: "Register User",
      operationId: "register user", // unique operation id
      parameters: [], // expected params
      requestBody: {
        // expected request body
        content: {
          // content-type
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RegsiterUser", // todo input data model
            },
          },
        },
      },
      // expected responses
      responses: {
        // response code
        201: {
          description: "User created successfully", // response desc
        },
        // response code
        500: {
          description: "Server error", // response desc
        },
      },
    },
  };