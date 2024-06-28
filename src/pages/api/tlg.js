const TelegramBot = require('node-telegram-bot-api')

const token = process.env.TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(token)

let state = {} // Объект для хранения состояний пользователей

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const chatId = message.chat.id
			const name = message.chat.first_name

			const options = {
				reply_markup: {
					keyboard: [
						[{ text: 'Расчет зарплаты исходя из процента' }],
						[{ text: 'Расчет процента из зарплаты' }],
						[{ text: 'Расчет общего процента' }],
					],
					one_time_keyboard: true,
					resize_keyboard: true,
				},
			}

			if (text === '/text') {
				await bot.sendMessage(
					chatId,
					`Привет ${name}! Давай посчитаем зарплату и процент! Выбери нужную кнопку.`,
					options
				)
			}
			if (text === 'Расчет зарплаты исходя из процента') {
				const message = await bot.sendMessage(chatId, 'Введи нужный процент:')
				state[chatId] = { step: 'percent', botMessageId: message.message_id }
			} else if (state[chatId] && state[chatId].step === 'percent') {
				const percent = parseFloat(text)
				if (!isNaN(percent)) {
					state[chatId].percent = percent / 100
					state[chatId].step = 'hours'

					deleteMessageWithDelay(chatId, msg.message_id)
					deleteMessageWithDelay(chatId, state[chatId].botMessageId)

					const message = await bot.sendMessage(
						chatId,
						'Введи количество часов:'
					)
					state[chatId].botMessageId = message.message_id
				} else {
					bot.sendMessage(
						chatId,
						'Пожалуйста, введите корректное число для процента.'
					)
				}
			} else if (state[chatId] && state[chatId].step === 'hours') {
				const hours = parseFloat(text)
				if (!isNaN(hours)) {
					state[chatId].hours = hours

					const resultHour = state[chatId].hours * 60 * state[chatId].percent

					const result = state[chatId].hours * resultHour

					deleteMessageWithDelay(chatId, msg.message_id)
					deleteMessageWithDelay(chatId, state[chatId].botMessageId)

					await bot.sendMessage(chatId, `Зарплата: ${result}`)
					delete state[chatId] // Очистка состояния после расчета
				} else {
					bot.sendMessage(
						chatId,
						'Пожалуйста, введите корректное число для часов.'
					)
				}
			}
			if (text === 'Расчет процента из зарплаты') {
				const message = await bot.sendMessage(chatId, 'Введи зарплату:')
				state[chatId] = { step: 'zarplata', botMessageId: message.message_id }
			} else if (state[chatId] && state[chatId].step === 'zarplata') {
				const zarplata = parseFloat(text)
				if (!isNaN(zarplata)) {
					state[chatId].zarplata = zarplata
					state[chatId].step = 'chas'

					deleteMessageWithDelay(chatId, msg.message_id)
					deleteMessageWithDelay(chatId, state[chatId].botMessageId)

					const message = await bot.sendMessage(
						chatId,
						'Введи количество часов:'
					)
					state[chatId].botMessageId = message.message_id
				} else {
					bot.sendMessage(
						chatId,
						'Пожалуйста, введите корректное число для процента.'
					)
				}
			} else if (state[chatId] && state[chatId].step === 'chas') {
				const chas = parseFloat(text)
				if (!isNaN(chas)) {
					state[chatId].chas = chas

					const resultHour = state[chatId].chas * 60 * state[chatId].chas

					const resultProcent = state[chatId].zarplata / resultHour

					const result = resultProcent * 100

					deleteMessageWithDelay(chatId, msg.message_id)
					deleteMessageWithDelay(chatId, state[chatId].botMessageId)

					await bot.sendMessage(chatId, `Процент: ${result}`)
					delete state[chatId] // Очистка состояния после расчета
				} else {
					bot.sendMessage(
						chatId,
						'Пожалуйста, введите корректное число для часов.'
					)
				}
			}
		} catch (error) {
			console.error('Произошла ошибка:', error)
			res.status(500).json({ error: 'Произошла ошибка: ' + error.message })
		}
	}
}
