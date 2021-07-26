// this file will contain all of our Vue code!
(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        }, // data ends here
        mounted: function () {
            console.log("my vue instance has mounted");

            axios
                .get("/start")
                .then(({ data }) => {
                    // this line right here updates data and will cause Vue to update our UI!!!
                    this.images = data;
                })
                .catch((err) => console.log("err in /start: ", err));
        },
        // this is where we are going to store all of our custom functions!
        methods: {
            uploadImage: function () {
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                axios.post("/upload", formData).then(({ data }) => {
                    // take the image object returned and put it into the existing array
                    console.log("data: ", data);
                });
            },
            handleFileSelection: function (e) {
                console.log("e: ", e);
                this.file = e.target.files[0];
            },
        },
    });
})();
