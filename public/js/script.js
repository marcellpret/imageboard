// this file will contain all of our Vue code!
(function () {
    // COMPONENT RELATED CODE
    Vue.component("popup-image", {
        template: "#popup-image-template",
        props: ["imgId"],
        data: function () {
            return {
                image: null,
            };
        },
        mounted: function () {
            console.log("this.image: ", this.image);

            axios
                .get(`/image/${this.imgId}`)
                .then(({ data }) => {
                    console.log("data in popup: ", data);
                    this.image = data;
                })
                .catch((err) => console.log("err in /more: ", err));
        },
        methods: {
            notifyParentToDoSth: function () {
                console.log(
                    "I want to let the main vue instance know it should do sth!"
                );
                this.$emit("close");
            },
            tellToDelete: function () {
                this.$emit("delete");
            },
        },
        watch: {
            // whenever question changes, this function will run
            imgId: function () {
                axios
                    .get(`/image/${this.imgId}`)
                    .then(({ data }) => {
                        console.log("data in popup: ", data);
                        this.image = data;
                    })
                    .catch((err) => console.log("err in /more: ", err));
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
                    console.log("data in comments: ", data);
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
            lowestId: null,
            moreImages: true,
        }, // data ends here
        mounted: function () {
            console.log("my vue instance has mounted");

            window.addEventListener("hashchange", () => {
                console.log(location.hash);
                this.imgSelected = location.hash.slice(1);
            });

            window.addEventListener("load", () => {
                location.hash = "";
            });

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
                    .get(`/more/${this.lowestId}`)
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
            selectImg: function (id) {
                console.log("id passed to selectImg:", id);
                this.imgSelected = id;
            },
            closeMe: function () {
                console.log(
                    "the component emitted close, so we should close the modal in the main vue instance!"
                );
                this.imgSelected = null;
                location.hash = "";
                // remember to set the value of moodSelected back to sth falsy in
                // order to make the component disappear!
            },
            deleteImage: function () {
                axios
                    .post(`/delete/${this.imgSelected}`)
                    .then(({ data }) => {
                        console.log("data: ", data);
                    })
                    .catch((err) => console.log("err in /delete: ", err));

                const index = this.images.findIndex(
                    (img) => img.id == this.imgSelected
                );
                this.images.splice(index, 1);

                this.closeMe();
            },
        },
    });
})();
