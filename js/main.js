  

  var router, layout, kittehModel;

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
    comments: "",

    sendContactInformation: function(e){
      var fn = this.get("firstname");
      var ln = this.get("lastName");


      //Everlive.Email.sendEmailFromTemplate(templateName, recipients, context, callback);
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