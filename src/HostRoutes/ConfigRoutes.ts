import * as express from 'express';

const router = express.Router();

router.all('/ioConfig', (req, res) =>
{
    res.send(this._iosConfig.Entries);
});

router.all('/config', (req, res) =>
{
    res.send(this._userConfig.ToString());
});

router.all(/^\/config\/([a-z0-9_\-]+)\/$/, (req, res) =>
{
    const key = req.params[0];

    this._userConfig.Delete(key);

    res.sendStatus(200);
});
