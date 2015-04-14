(function() {
  return {
    events: {
      'app.created':'loadOptions',
      'change .address':'onAddressSelected'
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
    // _brand: function(){
    //   return this.ticket().customField('custom_field_%@'.fmt(this.setting('brand_field_id')));
    // },
    // _mapping: _.memoize(function(){
    //   return JSON.parse(this.setting('mapping'));
    // })
  };
}());