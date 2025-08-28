import { getCollectionByName } from "../lib/db";

export const createTeam = async (reference: string, name: string, description: string, createdBy?: string) => {
    const TeamModel = getCollectionByName("team");
    if (!/^[a-z]+$/.test(reference)) {
        throw new Error('Team reference must contain only lowercase alphabets.');
    }

    const existingTeam = await TeamModel.findOne({ reference });
    if (existingTeam) {
        throw new Error('Team with this reference already exists.');
    }

    const newTeam = new TeamModel({ name, description, reference, createdBy, updatedBy: createdBy, createdAt: Date.now() });
    await newTeam.save();
    return newTeam;
};

export const getTeamByReference = async (reference: string) => {
    const TeamModel = getCollectionByName("team");
    const team = await TeamModel.findOne({ reference });
    if (!team) {
        throw new Error('Team not found');
    }
    return team;
};

export const updateTeamByReference = async (reference: string, name: string, description: string, updatedBy?: string) => {
    const TeamModel = getCollectionByName("team");
    const updatedTeam = await TeamModel.findOneAndUpdate(
        { reference },
        { name, description, updatedAt: Date.now(), updatedBy },
        { new: true, runValidators: true }
    );

    if (!updatedTeam) {
        throw new Error('Team not found');
    }
    return updatedTeam;
};

export const deleteTeamByReference = async (reference: string) => {
    const TeamModel = getCollectionByName("team");
    const deletedTeam = await TeamModel.findOneAndDelete({ reference: reference });

    if (!deletedTeam) {
        throw new Error('Team not found');
    }
    return deletedTeam;
};
