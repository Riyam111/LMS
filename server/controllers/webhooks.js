import {Webhook} from 'svix'
import User from '../models/User.js'

export const clerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Webhook secret needed!");
  }

  const payload = req.body;
  const headers = req.headers;

  const webhook = new Webhook(WEBHOOK_SECRET);
  let evt;
  try {
    evt = await webhook.verify(payload, headers);
  } catch (error) {
    res.status(400).json({
      message: "Webhook verification failed!",
    });
  }
  const { type, data } = evt;
  // console.log(evt);
  switch (type) {
    case "user.created":
      const newUser = new User({
        clerkUserId: data.id,
        name:
          data.first_name + " " + data.last_name ||
          data.email_addresses[0].email_address,
        email: data.email_addresses[0].email_address,
        imageUrl: data.profile_image_url,
      });

      await newUser.save();

      break;
    case "user.updated":
      await User.findOneAndUpdate(
        { clerkUserId: data.id },
        {
          name:
            data.first_name + " " + data.last_name ||
            data.email_addresses[0].email_address,
          email: data.email_addresses[0].email_address,
          imageUrl: data.profile_image_url,
        },
        { new: true }
      );
      break;

    case "user.deleted":
      await User.findOneAndDelete({
        clerkUserId: data.id,
      });
      break;

    default:
      break;
  }

  return res.status(200).json({
    message: "Webhook received",
  });
};
