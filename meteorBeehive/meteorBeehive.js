Messages = new Mongo.Collection("messages");

// Show date for a specific hive name
Router.route('/hive/:name', function() {
  this.render('message', {
    data: function () {
      return { messages: Messages.find({name: this.params.name}) };
    }
  });
  this.layout('layout');
},
{
  name: 'message.show'
});


// HomePage
Router.route('/', function() {
  this.render('meteorBeeHive');
  this.layout('layout');
});

// Admin page
Router.route('/admin', function() {
  this.render('admin');
  this.layout('layout');
});


// Hive/Name shows all data entered into the database so far for a given hive name
// Router.route('/home', function() {
//   this.render('meteorBeeHive');
//   this.layout('layout');
// });




if (Meteor.isClient) {
  Meteor.subscribe("messages");

  Template.admin.helpers({
    "messages": function() {
      return Messages.find(
        {},
        {sort: {createdOn: -1}}) || {};
      //return all message objects, or an empty object if DB is invalid
    }
  });

  Template.meteorBeeHive.events(
    {
      "submit form": function (event) {
        event.preventDefault();

        var hiveNameBox = $(event.target).find('input[name=HiveName]');
        var hiveNameText = hiveNameBox.val();

        var dateBox = $(event.target).find('input[name=ObsDate]');
        var dateText = dateBox.val();

        var durationBox = $(event.target).find('input[name=Duration]');
        var durationText = durationBox.val();

        var mitCountBox = $(event.target).find('input[name=MitCount]');
        var mitCountText = mitCountBox.val();

        if(hiveNameText.length > 0 && dateText.length > 0 && durationBox.length > 0 && mitCountText.length > 0) {
              Messages.insert(
              {
                name: hiveNameText,
                date: dateText,
                duration: durationText,
                mitCount: mitCountText,
                createdOn: Date.now()
              });
              hiveNameBox.val("");
              dateBox.val("");
              durationBox.val("");
              mitCountBox.val("");
              Router.go('/hive/' + hiveNameText);
        }
        else {
          //alert (name and message are both required.)
          console.log(messageBox);
          messageBox.classList.add("has-warning");
        }
        //alert("Name is " + nameText + ", msg is " + messageText);
      }
    }
  );
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish("messages", function() {
        return Messages.find();
      });
  });
}
