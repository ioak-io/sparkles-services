import { APP_REALM } from "../constants";
import { getCollectionByName } from "../lib/db";
import { JwtClaims } from "../types/JwtClaimTypes";

export const getAllTeams = async (claims: JwtClaims | undefined) => {
    const TeamModel = getCollectionByName("team");

    let teamReferences: string[] = [];

    if (claims?.resource_access?.[APP_REALM]?.roles) {
        const roles = claims.resource_access?.[APP_REALM]?.roles;
        const teamRoles = roles.filter(role => role.includes("-"));
        teamReferences = [...new Set(teamRoles.map(role => role.split("-")[0]))];
    }

    if (teamReferences.length === 0) {
        return [];
    }

    const teams = await TeamModel.find({ reference: { $in: teamReferences } });
    return teams;
};
