  

  var router, layout, navigationModel, contactModel;

  navigationModel = kendo.observable({
    homeClicked: function(){
      this.loadHome();
    },

    aboutClicked: function(){
      this.loadAbout();
    },

    contactClicked: function(){
      this.loadContact();
    },

    loadHome: function(){
      var homeView = new kendo.View("home-template");
      layout.showIn("#main-layout", homeView);

      $("#ulNavigation>li").removeClass("active");
      $("#liHome").addClass("active");
    },

    loadAbout: function(){
      var aboutView = new kendo.View("about-template");
      layout.showIn("#main-layout", aboutView);

      $("#gallery-layout").empty();
      $("#ulNavigation>li").removeClass("active");
      $("#liAbout").addClass("active");
    },

    loadContact: function(){
      var contactView = new kendo.View("contact-template", { model: contactModel });
      layout.showIn("#main-layout", contactView);

      $("#gallery-layout").empty();
      $("#ulNavigation>li").removeClass("active");
      $("#liContact").addClass("active");
    }
  });

  contactModel = kendo.observable({
    firstName: "",
    lastName: "",
    emailAddress: "",
    userComments: "",

    sendContactInformation: function(e){
      var validator = $("#contactForm").kendoValidator().data("kendoValidator");
      if (validator.validate()) {
        //alert(kendo.stringify(this));
        
        var recipients = {
          "Recipients": [ 
            "charles.catron@gmail.com"
          ],
          "Context":{
            "Subject":"Chili Fun Factory Contact Form Submission",
            "FromName": this.firstName + " " + this.lastName,
            "Comments": this.userComments,
            "FromEmail": this.emailAddress
          }
        };
        $.ajax({
          type: "POST",
          url: "http://api.everlive.com/v1/Metadata/Applications/tVkEHjxXqY4ybnML/EmailTemplates/94aafba0-1ffc-11e3-821d-8b72df785e43/send",
          contentType: "application/json",
          headers: { "Authorization" : "Accountkey 55LTUFyDAzL3wY4dN1EcoUM7GZFkorKtSMqxEIj0mprirjkd" },
          data: JSON.stringify(recipients),
          success: function(data){
            alert("Email successfully sent.");
          },
          error: function(error){
            alert(JSON.stringify(error));
          }
        });
      }
    }
  });


  // Views
  // -----

  // render a layout in to the "#main" element
  layout = new kendo.Layout("layout-template");
  layout.render("#main");

  //define the navigationView and show it in the layout template
  var navigationView = new kendo.View("navigation-template", { model: navigationModel });
  layout.showIn("#navigation-layout", navigationView);

  // Router
  // ------

  // Define a router with a basic routes
  router = new kendo.Router();

  router.route("about", function(id){
    navigationModel.loadAbout();
  });

  router.route("home", function() {
    navigationModel.loadHome();
  });

  router.route("contact", function() {
    navigationModel.loadContact();
  });

  router.route("/", function() {
    navigationModel.loadHome();
  });

  // start the router to handle the routes
  $(function() {
    router.start();
  });