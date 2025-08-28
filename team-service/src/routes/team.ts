import { Router } from 'express';
import { getClaims, verifyAndGetClaims } from '../middleware/jwt';
import { createTeam, getTeamByReference, updateTeamByReference, deleteTeamByReference } from '../services/teamService';
import { createOrUpdateTeam as createOrUpdateTeamPermissions, addUserToGroup, deleteTeam as deleteTeamPermissions } from '../services/permissionService';

const router = Router({ mergeParams: true });

router.post('/', getClaims, async (req, res: any) => {
    const { reference } = req.params;
    try {
        const { name, description } = req.body;
        const newTeam = await createTeam(reference, name, description, req.claims?.sub);

        await createOrUpdateTeamPermissions(reference, req.headers.authorization as string);

        if (req.claims?.sub) {
            await addUserToGroup(reference, req.claims.sub, ["admin", "user"], req.headers.authorization as string);
        }

        res.status(201).json(newTeam);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', getClaims, async (req, res: any) => {
    const { reference } = req.params;
    try {
        const team = await getTeamByReference(reference);
        res.json({
            team,
            message: "Claims extracted successfully",
            claims: req.claims,
            headers: req.headers
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/', getClaims, async (req, res: any) => {
    try {
        const { reference } = req.params;
        const { name, description } = req.body;
        const updatedTeam = await updateTeamByReference(reference, name, description, req.claims?.sub);
        res.json(updatedTeam);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/', getClaims, async (req, res: any) => {
    try {
        const { reference } = req.params;
        const deletedTeam = await deleteTeamByReference(reference);

        // Call permission service to delete team permissions
        await deleteTeamPermissions(reference, req.headers.authorization as string);

        res.status(200).json({ message: 'Team deleted successfully', team: deletedTeam });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

export default router;