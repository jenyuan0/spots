import nodemailer from 'nodemailer';

function formatObjectToHtml(obj) {
	return Object.entries(obj)
		.map(([key, value]) => {
			const formattedKey = key
				.replace(/([A-Z])/g, ' $1')
				.replace(/^./, (str) => str.toUpperCase())
				.replace(/\?/g, '');

			return `${formattedKey}: ${value}`;
		})
		.join('<br>');
}

export async function POST(req) {
	const body = await req.json();
	const authUser = process.env.EMAIL_SERVER_USER;
	const authPassword = process.env.EMAIL_SERVER_PASSWORD;
	const emailFrom = process.env.EMAIL_EMAIL_FROM;

	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			host: 'smtp.gmail.com',
			port: 465,
			secure: true, // true for 465, false for other ports
			auth: {
				user: authUser,
				pass: authPassword,
			},
		});

		// send to client
		const mailOptions = {
			from: `"${emailFrom}" <${authUser}>`,
			to: 'ashley@spots.paris',
			subject: 'Inquiry from SPOTS',
			html: formatObjectToHtml(body),
		};

		const info = await transporter.sendMail(mailOptions);
		return Response.json(info);
	} catch (err) {
		console.error(err);
		return Response.json({ error }, { status: 500 });
	}
}
