(function() {
  return {
    events: {
      'app.created':'loadOptions',
      'change .address':'onAddressSelected',

      // By not setting {brand_field_id} as a *required* parameter of the app, we give the admin the option
      // to whether or not use the branding functionality. Unfortunately, if the user choses *not* to use it 
      // (leave {brand_field_id} in blank), we cannot use this:
      //
      //    'ticket.custom_field_ticket.custom_field_{{brand_field_id}}.changed': 'brandChangedHandler'
      //
      // If {brand_field_id} is blank, the app would crash badly. So we'll be using '*.changed' instead
      // as a workaround until a better solution comes up.
      '*.changed': 'anyFieldChangedHandler'
    },
    requests: {
      getAddresses: function(next_page) {
        return {
          url: next_page || '/api/v2/recipient_addresses.json',
          success: function(response) {
            this.supportAddresses = this.supportAddresses.concat(response.recipient_addresses);
            if(response.next_page) {
              this.ajax('getAddresses', response.next_page);
            } else {
              this.parseResults(this.supportAddresses);
              // console.log('Got all the addresses.')
            }
          }
        };
      }
    },
    loadOptions: function() {
      this.supportAddresses = [];
      this.ajax('getAddresses');
    },
    parseResults: function(addresses) {
      this.addresses = addresses;
      var defaultAddress,
          recipientAddress,
          otherAddresses,
          newTicket,
          currentAddress = this.ticket().recipient(),
          currentLocation = this.currentLocation(),
          newTickets = this.setting("new_tickets?"),
          existingTickets = this.setting("existing_tickets?");
      if(currentLocation == 'new_ticket_sidebar' && newTickets === true) {
        newTicket = true;
        defaultAddress = _.filter(this.addresses, function(address) { return address.default === true;});
        otherAddresses = _.filter(this.addresses, function(address) { return address.default !== true;});
        this.switchTo('pickOne', {
          newTicket: newTicket,
          defaultAddress: defaultAddress,
          recipientAddress: recipientAddress,
          addresses: otherAddresses
        });
      } else if (currentLocation == 'ticket_sidebar' && existingTickets === true) {
        newTicket = false;
        recipientAddress = _.filter(this.addresses, function(address) { return address.email == currentAddress;});
        otherAddresses = _.filter(this.addresses, function(address) { return address.email != currentAddress;});
        this.switchTo('pickOne', {
          newTicket: newTicket,
          defaultAddress: defaultAddress,
          recipientAddress: recipientAddress,
          addresses: otherAddresses
        });
      }
    },
    onAddressSelected: function(e) {
      e.preventDefault();
      var address = this._brandEmail(),
          location = this.currentLocation();
      if(location == 'new_ticket_sidebar') {
        this.ticket().recipient(address);
        services.notify( this.I18n.t('notice.ticket_created', { id: this.ticket().id(), email: address }) );
      } else if(location == 'ticket_sidebar') {
      // if location is ticket_sidebar
        var id = this.ticket().id();
        this.ticket().recipient(address);
        // IF successful
        services.notify( this.I18n.t('notice.ticket_updated', { id: this.ticket().id(), email: address }) );
      }
    },
    _brandEmail: function(){
      return this.$('select.address').val();
    },

    // Handles the .changed event of any ticket field
    anyFieldChangedHandler: function(e){
      // If the changed field was {brand_field_id}
      if(!_.isEmpty(this.setting('brand_field_id')) && e.propertyName === 'ticket.custom_field_'+ this.setting('brand_field_id')){
        this.brandChangedHandler(e);
      }
    },

    // Handles the .change of custom_field_{brand_field_id} automatically selects the email address
    brandChangedHandler: function(e){
      // Fetches JSON map 
      var map = this._mapping(this.setting('brand_mapping'));

      // No JSON map, no fun :(
      if(map === null) return false; 

      // Checks if selected brand exists in map
      if(!_.has(map, e.newValue)) return false;

      // Checks if mapped email address for selected brand actually exists in the <select>
      if(!this.$("option[value='"+ map[e.newValue] +"']", 'select.address').size()) return false;

      this.$('select.address').val(map[e.newValue]).trigger('change');
    },

    // Returns the JSON map as an object, if valid.
    // If the JSON map is invalid (or it was not provided at all), a notification is shown to the user. 
    _mapping: _.memoize(function(s){
      try{
        return JSON.parse(s);
      } catch(e) {
        services.notify(this.I18n.t('notice.invalid_json'), 'error', 30000);
        return null;
      }
    })
  };
}());