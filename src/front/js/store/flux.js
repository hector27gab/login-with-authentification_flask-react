const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      token: JSON.parse(localStorage.getItem("token")) || null,
    },
    actions: {
      login: async (userData) => {
        const requestUser = {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(userData),
        };
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/login",
            requestUser
          );
          const data = await response.json();
          console.log(data);
          setStore({ token: data.token });
          return true;
        } catch (error) {
          console.log("Error in login", error);
        }
      },

      createUser: async (newUserData) => {
        const newUser = {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(newUserData),
        };
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/register",
            newUser
          );
          if (response.ok) {
            return true;
          }
        } catch (error) {
          console.log("Error in register", error);
        }
      },

      logOut: async () => {
        try {
          setStore({ token: null });
          console.log("Successful: logged out");
        } catch (error) {
          console.log("Error in logout", error);
        }
      },
    },
  };
};

export default getState;
