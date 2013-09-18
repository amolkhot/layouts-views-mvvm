
  var el = new Everlive('tVkEHjxXqY4ybnML');
  var router, layout, navigationModel, contactModel, loader;

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
      contactModel.init();
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
    emailSent: false,
    init: function(){
      this.set("firstName", "");
      this.set("lastName", "");
      this.set("emailAddress", "");
      this.set("userComments", "");
      this.set("emailSent", "");
    },

    sendContactInformation: function(e){
      loader.show();
      var self = this;
      var validator = $("#contactForm").kendoValidator().data("kendoValidator");
      if (validator.validate()) {
        //alert(kendo.stringify(this));
        
        var data = Everlive.$.data('ContactForm');
        data.create(
          { 
            'firstName': self.firstName,
            'lastName': self.lastName,
            'emailAddress': self.emailAddress,
            'userComments': self.userComments
          }, 
          function(data){
            var recipients = {
              "Recipients": [ 
                "charles.catron@gmail.com"
              ],
              "Context":{
                "firstName": self.firstName,
                "lastName": self.lastName,
                "emailAddress": self.emailAddress,
                "userComments": self.userComments
              }
            };
            $.ajax({
                type: "POST",
                url: 'https://api.everlive.com/v1/Metadata/Applications/560b1cc0-1c7f-11e3-b224-8396558d54d5/EmailTemplates/ContactEmail/send',
                contentType: "application/json",
                headers: { "Authorization" : "Accountkey WwfrqQ7tnKPeMLIpBmVFrRnAYfgRA1eVxU1je4C1kglU1YsJ" },
                data: JSON.stringify(recipients),
                success: function(data){
                    self.set("emailSent", true);
                    alert("Your email has been sent.");
                },
                error: function(error){
                    self.set("emailSent", false);
                    alert("We had a problem sending your email");
                }
            });  
          },
          function(error){
            alert(JSON.stringify(error));
          }
        );
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

    var docHeight = $(document).height();

    $("body").append("<div id='overlay'><div class='circle'></div><div class='circle1'></div></div>");
    loader = $("#overlay") 
    loader
      .height(docHeight)
      .css({
         'opacity' : 0.4,
         'position': 'fixed',
         'top': 0,
         'left': 0,
         'background-color': 'black',
         'width': '100%',
         'z-index': 5000,
         'margin' : '0 auto',
         'padding-top': '15em'
    });
    loader.hide();

    $( document ).ajaxComplete(function() {
      loader.hide();
    });
    $( document ).ajaxStart(function() {
      loader.show();
    });
  });