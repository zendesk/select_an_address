(function() {
  return {
    customFieldRegExp: new RegExp(/custom_field_([0-9]+)/),
    events: {
      'ticket.save':'onTicketSave'
    },
    requests: {
      createTicket: function(data) {
        return {
          url: '/api/v2/tickets.json',
          dataType: 'json',
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json'
        };
      },
      updateTicket: function(data, id) {
        return {
          url: helpers.fmt('/api/v2/tickets/%@.json', id),
          dataType: 'json',
          type: 'PUT',
          data: JSON.stringify(data),
          contentType: 'application/json'
        };
      }
    },

    onTicketSave: function() {
      return this.promise(function(done, fail){
        var self = this,
        attributes = {};
        var location = this.currentLocation();
        if (this.shouldCreateTicket(done, fail)){

          // If the location is NEW ticket the app should create a ticket

          if(location == 'new_ticket_sidebar') {
            try {
              attributes = this.serializeTicketAttributes(location);

              this.ajax('createTicket', attributes)
                .done(function(data){
                  fail('Used the App to submit.');
                  services.notify(this.I18n.t('notice.ticket_created', { id: data.ticket.id }));
                  self.clearAttributes();

                })
                .fail(function(data){
                  fail(data.responseText);
                });
            } catch(e) {
              fail(e.message);
            }
          } else {
          // if location is not new_ticket_sidebar it should update the existing ticket
            var id = this.ticket().id();
            try {
              attributes = this.serializeTicketAttributes(location);

              this.ajax('updateTicket', attributes, id)
                .done(function(data){
                  fail('Used the App to submit. Please close/refresh this tab to avoid confusion.');
                  services.notify(helpers.fmt('Ticket #%@ updated.', data.ticket.id)); // change message to updated
                  this.comment().text('');
                })
                .fail(function(data){
                  fail(data.responseText);
                });
            } catch(e) {
              fail(e.message);
            }
          }

        }
      });
    },

    shouldCreateTicket: function(done, fail){
      if (_.isEmpty(this.brandEmail())) {
        if (this.setting('force_selection_of_brand')) {
          fail(this.I18n.t('errors.brand'));
        } else {
          done();
        }
        return false;
      } else {
        return true;
      }
    },

    serializeTicketAttributes: function(location){
      var ticket = this.ticket();
      var attributes = {};
      if(location == 'new_ticket_sidebar') { // if the location is new set certain attributes
        attributes = {
          subject: ticket.subject(),
          comment: this.serializeCommentAttributes(),
          description: this.comment().text(), // not for existing tickets
          priority: ticket.priority(),
          status: ticket.status(),
          tags: ticket.tags(),
          type: ticket.type(),
          collaborators: _.map(ticket.collaborators(), function(cc) { return cc.email(); }),
          ticket_form_id: (ticket.form() && ticket.form().id()) || null,
          assignee_id: (ticket.assignee().user() && ticket.assignee().user().id()) || null,
          group_id: (ticket.assignee().group() && ticket.assignee().group().id()) || null,
          recipient: this.brandEmail(),
          custom_fields: this.serializeCustomFields(),
          submitter_id: this.currentUser().id()
        };
      } else { // if the location is not new don't set description or submitter
        var subject = ticket.subject(),
          comment = this.serializeCommentAttributes(),
          priority = ticket.priority(),
          status = ticket.status(),
          tags = ticket.tags(),
          type = ticket.type(),
          collaborators = _.map(ticket.collaborators(), function(cc) { return cc.email(); }),
          ticket_form_id = (ticket.form() && ticket.form().id()),
          assignee_id = (ticket.assignee().user() && ticket.assignee().user().id()),
          group_id = (ticket.assignee().group() && ticket.assignee().group().id()),
          recipient = this.brandEmail(),
          custom_fields = this.serializeCustomFields();
        if(subject) {
          attributes.subject = subject;
        }
        if(comment) {
          attributes.comment = comment;
        }
        if(priority && priority != '-') {
          attributes.priority = priority;
        }
        if(status && status != 'new') {
          attributes.status = status;
        }
        if(tags) {
          attributes.tags = tags;
        }
        if(type && type != 'ticket') {
          attributes.type = type;
        }
        if(collaborators) {
          attributes.collaborators = collaborators;
        }
        if(ticket_form_id) {
          attributes.ticket_form_id = ticket_form_id;
        }
        if(assignee_id) {
          attributes.assignee_id = assignee_id;
        }
        if(group_id) {
          attributes.group_id = group_id;
        }
        if(recipient) {
          attributes.recipient = recipient;
        }
        if(custom_fields) {
          attributes.custom_fields = custom_fields;
        }

        // attributes = {
        //   subject: ticket.subject(),
        //   comment: this.serializeCommentAttributes(),
        //   priority: ticket.priority(),
        //   status: ticket.status(),
        //   tags: ticket.tags(),
        //   type: ticket.type(),
        //   collaborators: _.map(ticket.collaborators(), function(cc) { return cc.email(); }),
        //   ticket_form_id: (ticket.form() && ticket.form().id()) || null,
        //   assignee_id: (ticket.assignee().user() && ticket.assignee().user().id()) || null,
        //   group_id: (ticket.assignee().group() && ticket.assignee().group().id()) || null,
        //   recipient: this.brandEmail(),
        //   custom_fields: this.serializeCustomFields()
        // };
      } // end if/else

      if (ticket.requester()) {
        if (ticket.requester().id()) {
          attributes.requester_id = ticket.requester().id();
        } else if (ticket.requester().email()) {
          attributes.requester = {
            email: ticket.requester().email(),
            name: ticket.requester().email().split('@')[0]
          };
        } else if (this._isEmpty(ticket.requester().email()) &&
                   this.setting('mandatory_requester_email')) {
          throw({ message: this.I18n.t('errors.requester_email') });
        }
      }

      return { ticket: attributes };
    },

    serializeCommentAttributes: function() {

      var comment = this.comment();
      var public = true;
      if (comment.type() == "internalNote") {
        public = 'false';
      }
      var attributes = { body: comment.text(), public: public };
      if (comment.attachments().length > 0) {
        attributes.uploads = [];

        _.each(comment.attachments(), function(attachment) {
          attributes.uploads.push(attachment.token());
        });
      }

      return attributes;
    },

    serializeCustomFields: function(){
      var fields = [];

      this.forEachCustomField(function(field){
        if (!this._isEmpty(field.value)){
          fields.push({
            id: field.id,
            value: field.value
          });
        }
      });

      return fields;
    },

    forEachCustomField: function(block){
      _.each(this._customFields(), function(field){
        var id = field.match(this.customFieldRegExp)[1],
            value = this.normalizeValue(this.ticket().customField(field));

        block.call(this, {
          label: field,
          id: id,
          value: value
        });
      }, this);
    },

    normalizeValue: function(value){
      return {
        "yes": true,
        "no": false
      }[value] || value;
    },

    clearAttributes: function(){
      this.ticket().subject('');
      this.comment().text('');
      this.ticket().priority('-');
      this.ticket().type('ticket');
      this.ticket().requester({ email: ''});
      this.ticket().tags([]);
      this.ticket().status('new');

      this.forEachCustomField(function(field){
        this.ticket().customField(field.label, '');
      });
    },

    brandEmail: function(){
      var group = this.ticket().assignee().group(),
      brand = this._mapping()[this._brand()],
      email,
      name;
      if (!brand) {
        services.notify('No franchise set. Using default.', 'notice');
        //TODO get the name of the field and put it in the error string

      } else if(!group) {
        name = "Default";
        email = brand[name];
        console.log(email);
        services.notify(helpers.fmt('No group set. Using default email address %@.', email), 'notice');
        return email;

      } else {
        name = group.name();
        email = brand[name];
        console.log(email);
        return email;
      }
     
    },

    _customFields: _.memoize(function(){
      return _.filter(_.keys(this.containerContext().ticket), function(field){
        return field.match(this.customFieldRegExp);
      }, this);
    }),

    _brand: function(){
      return this.ticket().customField('custom_field_%@'.fmt(this.setting('brand_field_id')));
    },

    _isEmpty: function(field){
      return _.isUndefined(field) ||
        _.isNull(field) ||
        field === '-';
    },

    _mapping: _.memoize(function(){
      return JSON.parse(this.setting('mapping'));
    })
  };
}());
