const Group =  require("../models/Group")

const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;


    if (!name || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: "Group name and members are required" });
    }


    const group = await Group.create({ name, members });
    
    res.status(201).json({
      message: "Group created successfully",
      group,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Unable to create group" });
  }
};

module.exports =  { createGroup };
