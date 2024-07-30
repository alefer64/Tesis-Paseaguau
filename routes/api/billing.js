const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Transaction = require('../../models/TransactionSchema');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { single } = require('../../multerConfig');

const client = new MercadoPagoConfig({ accessToken: '' });

router.post('/hacer-premium', auth, async (req, res) => {
  const amount = 2500;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    const newTransaction = new Transaction({
      user: req.user.id,
      type: 'subscription',
      amount: amount,
      status: 'pending',
      description: 'Suscripción Premium'
    });

    await newTransaction.save();

    const preference = new Preference(client);

    preference.create({
      body: {
        items: [
          {
            title: 'Suscripción Premium',
            quantity: 1,
            currency_id: 'ARS',
            unit_price: amount
          }
        ],
        back_urls: {
          success: `${process.env.REACT_APP_CLIENT_URL}settings/success/${newTransaction._id}`,
          failure: `${process.env.REACT_APP_CLIENT_URL}settings/failure/${newTransaction._id}`,
          pending: `${process.env.REACT_APP_CLIENT_URL}settings/pending/${newTransaction._id}`
        },
        notification_url: `http://paseaguau.com/api/billing/notification`,
        auto_return: 'approved'
      }
    })
      .then((response) => {
        res.json({ preferenceId: response.id });
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).send('Error del servidor');
      });

  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Error del servidor');
  }
});

router.post('/notification', async (req, res) => {
  const { id, topic } = req.body;

  if (topic === 'payment') {
    try {
      const payment = await client.payment.get(id);
      const { status, external_reference } = payment.body;

      let transaction = await Transaction.findById(external_reference);
      if (!transaction) return res.status(404).json({ msg: 'Transacción no encontrada' });

      transaction.status = status === 'approved' ? 'successful' : 'failed';

      if (status === 'approved') {
        const user = await User.findById(transaction.user);
        user.premium = true;
        await user.save();
      }

      await transaction.save();
      res.status(200).send('Notificación recibida y procesada');
    } catch (err) {
      console.error('Error al procesar la notificación:', err.message);
      res.status(500).send('Error del servidor');
    }
  } else {
    res.status(400).send('Notificación no relevante');
  }
});

router.put('/actualizar-estado/:id', auth, async (req, res) => {
  const { estado } = req.body;

  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ msg: 'Transacción no encontrada' });

    transaction.status = estado;

    if (estado === 'approved') {
      const user = await User.findById(transaction.user);
      user.premium = true;
      await user.save();
    }

    if (estado === 'successful') {
      const user = await User.findById(transaction.user);
      user.premium = true;
      await user.save();
    }

    await transaction.save();

    res.json(transaction);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Error del servidor');
  }
});

router.get('/historial', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Error del servidor');
  }
});

router.post('/hacer-premium', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    user.premium = true;
    await user.save();

    res.json({ msg: 'Usuario ahora es premium' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Error del servidor');
  }
});


module.exports = router;
