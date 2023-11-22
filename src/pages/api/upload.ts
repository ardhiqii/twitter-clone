import { error } from "console";
import { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storageFB } from "../../../config/storage";
import fs from "fs";
import { CustomSession, authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import User from "../../../models/User";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: CustomSession | null = await getServerSession(
    req,
    res,
    authOptions
  );
  try {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      const type = Object.keys(files)[0];
      const file = files[type][0];
      const storageRef = ref(storageFB, `${type}/${file.originalFilename}`);

      await uploadBytes(storageRef, fs.readFileSync(file.path));
      const imageURL = await getDownloadURL(storageRef);
      if (type === "cover" || type === "image") {
        const user = await User.findByIdAndUpdate(
          session?.user?.id,
          { [type]: imageURL },
          { new: true }
        );
        res.status(200).json({ [type]: imageURL, user });
      }else{
        res.status(200).json({ [type]: imageURL});
      }

      fs.unlinkSync(file.path);
    });
  } catch (e) {
    console.error("Error handling file upload:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
