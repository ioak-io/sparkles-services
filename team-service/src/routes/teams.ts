import { Router } from 'express';
import { getAllTeams } from '../services/teamsService';
import { getClaims } from '../middleware/jwt';

const router = Router({ mergeParams: true });

router.get('/', getClaims, async (req, res: any) => {
    try {
        const teams = await getAllTeams(req.claims);
        res.status(200).json(teams);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
