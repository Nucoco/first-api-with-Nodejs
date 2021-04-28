// const { json } = require("body-parser");//some errors occur because of this code.

//be a module by using immediate function to restrict the scope.
const usersModule = (() => {
    const BASE_URL = "http://localhost:3000/api/v1/users";

    //header setting
    const headers = new Headers();
    headers.set("Content-Type", "application/json");//to indicate content-type of the body is json data.

    const handleError = async (res) => {
        const resJson = await res.json();

        switch (res.status) {
            case 200://GET or PUT success
                alert(resJson.message);
                window.location.href = "/";//to switch the page to route page( index.html)
                break;
            case 201://POST success
                alert(resJson.message);
                window.location.href = "/";//to switch the page to route page( index.html)
                break;
            case 400://Client error about request parameter
                alert(resJson.error);
                break;
            case 404://Client error with Not found.
                alert(resJson.error);
                break;
            case 500://Server error
                alert(resJson.error);
                break;
            default:
                alert("An Error occurs with some reasons.");
                break;
        }
    }

    return {
        fetchAllUsers: async () => {
            //first  arg: "URL"
            //second arg: "query parameter"
            //without second arg, fetch method throw a "GET request" to the URL(the first arg).
            //and then, "app.js" will response.
            //fetch method returns an array of user records.
            const res = await fetch(BASE_URL);
            const users = await res.json();//parse: json to object(js)

            for(let i=0; i<users.length; i++){
                const user = users[i];
                const body = `<tr>
                                <td>${user.id}</td>
                                <td>${user.name}</td>
                                <td>${user.profile}</td>
                                <td>${user.date_of_birth}</td>
                                <td>${user.created_at}</td>
                                <td>${user.updated_at}</td>
                                <td><a href="edit.html?uid=${user.id}">edit</a></td>
                            </tr>`;
                document.getElementById("users-list").insertAdjacentHTML("beforeend", body);
            }
        },

        createUser: async () => {
            const name = document.getElementById("name").value;
            const profile = document.getElementById("profile").value;
            const dateOfBirth = document.getElementById("date-of-birth").value;
        
            //a body for request
            const body = {
                name: name,
                profile: profile,
                date_of_birth: dateOfBirth
            }

            const res = await fetch(BASE_URL, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
            });
            return handleError(res);
        },

        setExitingValue: async (uid) => {
            const res = await fetch(BASE_URL + "/" + uid);
            const resJson = await res.json();

            document.getElementById('name').value = resJson.name;
            document.getElementById("profile").value = resJson.profile;
            document.getElementById("date-of-birth").value = resJson.date_of_birth;
        },

        saveUser: async (uid) => {
            const name = document.getElementById("name").value;
            const profile = document.getElementById("profile").value;
            const dateOfBirth = document.getElementById("date-of-birth").value;
        
            //a body for request
            const body = {
                name: name,
                profile: profile,
                date_of_birth: dateOfBirth
            }

            const res = await fetch(BASE_URL + "/" + uid, {
                method: "PUT",
                headers: headers,
                body: JSON.stringify(body)
            });
            return handleError(res);
        },

        deleteUser: async (uid) => {
            const ret = "Do you really delete the user?";
            if(!ret){
                return false;
            }else{
                const res = await fetch(BASE_URL + "/" + uid, {
                    method: "DELETE",
                    headers: headers
                });
                return handleError(res);
            }
        }
    };
})();