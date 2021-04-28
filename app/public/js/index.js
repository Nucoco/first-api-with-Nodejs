const indexModule = (() => {

    const path = window.location.pathname;

    switch (path){
        case "/":
            //set an Event Listener for to click the search button.
            document.getElementById("search-btn").addEventListener("click", () => {
                return searchModule.searchUsers();
            });
            return usersModule.fetchAllUsers();

        case "/create.html":
            document.getElementById("save-btn").addEventListener("click", () => {
                return usersModule.createUser();
            });
            document.getElementById("cancel-btn").addEventListener("click", () => {
                return window.location.href = '/';
            });
            break;

        case "/edit.html":
            const uid = window.location.search.split('?uid=')[1];

            document.getElementById("save-btn").addEventListener("click", () => {
                return usersModule.saveUser(uid);
            });
            document.getElementById("cancel-btn").addEventListener("click", () => {
                return window.location.href = '/';
            });
            document.getElementById("delete-btn").addEventListener("click", () => {
                return usersModule.deleteUser(uid);
            });

            return usersModule.setExitingValue(uid);

        default:
            break;
    }    
})();