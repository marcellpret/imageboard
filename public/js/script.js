// this file will contain all of our Vue code!
(function () {
    // COMPONENT RELATED CODE
    Vue.component("popup-image", {
        template: "#popup-image-template",
        props: ["imgId", "imgTitle", "imgDescription", "imgUsername", "imgUrl"],
        data: function () {
            return {
                name: "Scallion",
            };
        },
        mounted: function () {},
        methods: {
            notifyParentToDoSth: function () {
                console.log(
                    "I want to let the main vue instance know it should do sth!"
                );
                this.$emit("close");
            },
        },
    });

    Vue.component("comments-component", {
        template: "#comments-template",
        props: ["imgId"],
        data: function () {
            return {
                comments: [],
                user_comment: "",
                text: "",
            };
        },
        mounted: function () {
            console.log("imgId: ", this.imgId);
            axios
                .get("/comments", { params: { id: this.imgId } })
                .then(({ data }) => {
                    // this line right here updates data and will cause Vue to update our UI!!!
                    this.comments = data;
                    console.log("data: ", data);
                })
                .catch((err) => console.log("err in /start: ", err));
        },
        methods: {
            addComment: function () {
                var cmt = {
                    text: this.text,
                    user_comment: this.user_comment,
                    image_id: this.imgId,
                };
                axios.post("/comment", cmt).then(({ data }) => {
                    // take the image object returned and put it into the existing array
                    this.comments.unshift(data);
                    console.log("data: ", data);
                });
            },
        },
    });
    //////////////////////// THINGS WE ADDED TO OUR MAIN VUE INSTANCE ///////////////////
    // properties we added to our data object:

    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            imgSelected: null,
            imgTitle: "",
            imgDescription: "",
            imgUsername: "",
            imgUrl: "",
            lowestId: null,
            moreImages: true,
        }, // data ends here
        mounted: function () {
            console.log("my vue instance has mounted");

            axios
                .get("/start")
                .then(({ data }) => {
                    // this line right here updates data and will cause Vue to update our UI!!!
                    this.images = data;
                    this.lowestId = this.images[this.images.length - 1].id;
                    console.log("this.lowestId: ", this.lowestId);
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
                    this.images.unshift(data);
                    console.log("data: ", data);
                });
            },
            getMore: function () {
                axios
                    .get("/more", { params: { lowestId: this.lowestId } })
                    .then(({ data }) => {
                        this.images.push(...data);
                        console.log("this.lowestId: ", this.lowestId);
                        console.log("this.images: ", this.images);

                        this.lowestId = this.images[this.images.length - 1].id;

                        if (
                            this.lowestId ===
                            this.images[this.images.length - 1].lowestId
                        ) {
                            this.moreImages = false;
                        }
                    })
                    .catch((err) => console.log("err in /more: ", err));
            },

            handleFileSelection: function (e) {
                console.log("e: ", e);
                this.file = e.target.files[0];
            },
            selectImg: function (id, title, description, username, url) {
                console.log("id passed to selectImg:", id);
                this.imgSelected = id;
                this.imgTitle = title;
                this.imgDescription = description;
                this.imgUsername = username;
                this.imgUrl = url;
            },
            closeMe: function () {
                console.log(
                    "the component emitted close, so we should close the modal in the main vue instance!"
                );
                this.imgSelected = null;
                // remember to set the value of moodSelected back to sth falsy in
                // order to make the component disappear!
            },
        },
    });
})();
