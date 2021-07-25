// this file will contain all of our Vue code!
(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
        }, // data ends here
        mounted: function () {
            console.log("my vue instance has mounted");

            axios
                .get("/start")
                .then(({ data }) => {
                    // this line right here updates data and will cause Vue to update our UI!!!
                    this.images = data;
                })
                .catch((err) => console.log("err in /cities: ", err));
        },
        // this is where we are going to store all of our custom functions!
        // methods: {
        //     myFunction: function (arg) {
        //         console.log("myFn is running!!!", arg);
        //     },
        // },
    });
})();
