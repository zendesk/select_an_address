:warning: *Use of this software is subject to important terms and conditions as set forth in the License file* :warning:

# Brand Tickets App

## Description:

This App allows you to define from which email address a ticket update should be sent. It pulls the list of available addresses (Support Addresses) and provides them as options in a dropdown in the app sidebar.

## App location:

* Ticket sidebar

## Features:

* Create tickets with different branded email addresses
* Update tickets with different branded email addresses

## Set-up/installation instructions:

### Installation

1. Create the app with the zip file downloaded from this github page.
2. Browse the "Private App" section of the marketplace.
3. Click on the "Ticket for brand" app.

* **Force selection of brand:** Make the brand selection mandatory.
* **Mandatory requester email:** Make the requester email address mandatory.

### Automatic Brand x Email assignment

If your tickets have a custom field for **Brand** selection, you may set the app to automatically select an email address based on the brand selection. These fields become required to activate this feature:

* **Brand Field ID:** Input the Custom Ticket Field ID created for brand selection. We recommend this field to be a _drop-down list_.
* **Brand x Email JSON mapping:** Create your brand x email associations in a valid JSON format, e.g. `{ "brand1":"email@example.com", "other_brand":"account@domain.com" }`. _Don't forget the quotation marks!_

**Voila**, reload your Zendesk and everything should be working fine. Go to the new ticket view, select an address in the app (in the sidebar), enter ticket info and click submit. Your ticket should have been created/updated with the given recipient.

## Contribution:

Pull requests are welcome.

## Screenshot(s):

![](/assets/screenshot_installation.png)
