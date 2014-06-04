:warning: *Use of this software is subject to important terms and conditions as set forth in the License file* :warning:

# Create Ticket for brand App

## Description:

This App will help you create tickets with predefined recipients.

Let's say your product is available across multiple kingdoms and you want to use a different email address for each kingdom. First create a custom dropdown field with the name of the kingdoms.

It should look like this: 

![](http://f.cl.ly/items/0a1P3E3z190t193Z3i22/Screen%20Shot%202013-09-30%20at%2010.11.20.png)

Once done, keep the ID of this custom field on the side.

## App location:

* Ticket sidebar (THIS IS A NO TEMPLATE APP - IT WILL NOT SHOW ANYWHERE)

## Features:

* Create tickets for different brands
* Pull information from a custom field
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
    "Default": "winterfell@wildfireretailer.got"
    "Support": "support-winterfell@wildfireretailer.got"
  },
  "kingdom_of_the_mountain_and_the_vale": {
    "Support": "support-@wildfireretailer.got"
  },
  "kingdom_of_the_isles_and_rivers": {
    "Support": "support-harrenhal@wildfireretailer.got"
  },
  "kingdom_of_the_rock": {
    "Support": "support-casterlyrock@wildfireretailer.got"
  },
  "kingdom_of_the_stormlands": {
    "Support": "support-stormsend@wildfireretailer.got"
  },
  "kingdom_of_the_reach": {
    "Support": "support-highgarden@wildfireretailer.got"
  },
  "dorne":  {
    "Support": "support-sunspear@wildfireretailer.got"
  }
}
```
* **Force selection of brand:** Make the brand selection mandatory.
* **Mandatory requester email:** Make the requester email address mandatory.

**Voila**, reload your Zendesk and everything should be working fine. Go to the new ticket view, select a brand, enter information and click submit. Your ticket should have been created with the given recipient.

## Contribution:

Pull requests are welcome.

## Screenshot(s):

(THIS IS A NO TEMPLATE APP - IT WILL NOT SHOW ANYWHERE)

