:warning: *Use of this software is subject to important terms and conditions as set forth in the License file* :warning:

# Brand Tickets App

## Description:

This App allows you to define from which email address a ticket update should be sent. First it considers the value of a custom dropdown field, and then (optionally) by group.

Let's say your product is available across multiple kingdoms and you want to use a different email address for each kingdom. First create a custom dropdown field with the name of the kingdoms.

It should look like this: 

![](http://f.cl.ly/items/0a1P3E3z190t193Z3i22/Screen%20Shot%202013-09-30%20at%2010.11.20.png)

Once done, keep the ID of this custom field on the side.

## App location:

* Ticket sidebar

## Features:

* Create tickets with different branded email addresses
* Update tickets with different branded email addresses
* Pull information from a custom field
* Pull information from the Group value of the ticket
* No Template App

## Set-up/installation instructions:

Installation

1. Create the app with the zip file downloaded from this github page.
2. Browse the "Private App" section of the marketplace.
3. Click on the "Ticket for brand" app.

Ok, now you should be on the app settings page, let me guide you through.

* **Brand Field ID:** Id of the previously created custom field.
* **Email-Brand mapping JSON:** A valid JSON object that maps your brand (kingdom) with an email address, in our case, it could look like this:

```json
{
  "kingdom_of_the_north": {
    "Default": "winterfell@wildfireretailer.got",
    "Support": "support-winterfell@wildfireretailer.got"
  },
  "kingdom_of_the_mountain_and_the_vale": {
    "Default": "eyrie@wildfireretailer.got",
    "Support": "support-eyrie@wildfireretailer.got"
  },
  "kingdom_of_the_isles_and_rivers": {
    "Default": "harrenhal@wildfireretailer.got",
    "Support": "support-harrenhal@wildfireretailer.got"
  },
  "kingdom_of_the_rock": {
    "Default": "casterlyrock@wildfireretailer.got",
    "Support": "support-casterlyrock@wildfireretailer.got"
  },
  "kingdom_of_the_stormlands": {
    "Default": "stormsend@wildfireretailer.got",
    "Support": "support-stormsend@wildfireretailer.got"
  },
  "kingdom_of_the_reach": {
    "Default": "highgarden@wildfireretailer.got",
    "Support": "support-highgarden@wildfireretailer.got"
  },
  "dorne":  {
    "Default": "sunspear@wildfireretailer.got",
    "Support": "support-sunspear@wildfireretailer.got"
  }
}
```
* **Force selection of brand:** Make the brand selection mandatory.
* **Mandatory requester email:** Make the requester email address mandatory.

Now make sure the email addresses you specified in your JSON map are configured as Support Addresses under Settings > Channels > Email.

**Voila**, reload your Zendesk and everything should be working fine. Go to the new ticket view, select a brand using your custom field, enter information and click submit. Your ticket should have been created with the given recipient.

## Contribution:

Pull requests are welcome.

## Screenshot(s):

(THIS IS A NO TEMPLATE APP - IT WILL NOT SHOW ANYWHERE)

