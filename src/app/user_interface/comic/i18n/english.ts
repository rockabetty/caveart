const english = {
	comicsDashboard: {
		actions: {
			overview: "Overview",
			edit: "Edit",
			pages: "Pages",
			comments: "Comments",
			statistics: "Statistics"
		}
	},
	comicPages: {
		add: "Add page",
		view: "View page",
		addAnother: "Add another",
		newPage: {
			uploadConfirmation: "Your new page was uploaded!",
			generalError: "Something went wrong. Please try again",
			presignFailure: "Something happened with our image uploader! Please try again.",
			imageTooBig: "Your image size exceeds the {{ maxMegabytes }}MB limit.",
			wrontFormat: "Wrong format. Please upload an image file.",
			noImage: "There's no image selected.",
			uploadYourImage: "Upload your image",
			releaseDate: "Release date",
			tags: {
				label: "Tags",
				helperText: "Separate your tags with commas (,)."
			},
			authorComment: {
				label: "Author comment",
				placeholder: "Tell us about your favorite part of this page, your process, or whatever comes to mind."
			},
			number: "Next page number: {{ nextNumber }}",
			linkRequiredIfExternal: "If you are using an external image, you need an image link." 
		},
	},
	comicProfile: {
		editSuccessful: "Your changes have been saved.",
		comicCreated: "Your comic has been created!",
		noComics: "You don't have any comics yet!",
		create: "Create a comic",
		edit: "Edit profile",
		save: "Save changes",
		coverImageSize: "Cover images can be up to {{megabytes}} megabytes.",
		coverImage: "Cover image",
		basicInfo: "Overview",
		title: "Title",
		subdomain: "Subdomain",
		description: "Description",
		visibility: {
			name: "Visibility",
			public: "Public (Accessible through a search)",
			unlisted: "Unlisted (Hidden from search engines)",
			private: "Private (only invitees and admins)",
		},
		deletion: {
			deleteButtonLabel: "Delete",
			isDeleted: "This comic has been deleted.",
			confirmationHeading: "Are you sure?",
			instructions: "Deletion of a comic is permanent! To confirm, type the subdomain of the comic into the textbox.",
			cancelDeletion: "Cancel",
			confirmDeletion: "Delete",
			invalidDeletion: "This comic subdomain isn't right. Check for typos.",
			helperText: "Type the comic subdomain as it appears on the comic profile.",
			comicName: "Comic title to delete"
		},
		likes: {
			name: "Likes",
			enabled: "Users can like comic pages",
		},
		comments: {
			name: "Comments",
			allowed: "Users can comment freely",
			moderated: "Comments are moderated",
			disabled: "Comments are disabled",
		},
		helperTexts: {
			subdomain:
				"A-Z, numbers, hyphens and undescores only.  Your comic will be hosted at http://{{domain}}.caveartwebcomics.com",
			description: "Tell us about your comic!",
		},
		errors: {
			"403": "You don't have permission to make changes to this comic.",
			titleMissing: "Your comic needs a name!",
			subdomainMissing: "Your comic needs a subdomain.",
			thumbnailMissing: "No thumbnail provided.",
			redirect: {
				prompt: "There is no comic here. If you recently changed your comic's subdomain, this page is outdated since it's using the old subdomain.",
				linkLabel: "Try again"
			}
		},
	},
	contentWarnings: {
		title: "Content warnings",
		description:
			"Help users filter out unwanted content (such as for personal preferences, NSFW controls, and so on) by selecting any content warning labels that apply.",
		absent: "None",
		sexualContent: "Sexual/Suggestive content",
		violentContent: "Death/violence",
		languageContent: "Sensitive content",
		substanceContent: "Drugs/alcohol",
		Nudity: {
			name: "Nudity",
			definition:
				"Naked bodies with no censorship wahtsoever.  If there are depictions of genitalia then you need to mark it 'frontal nudity'.",
			someNudity: "Partial or mild nudity",
			frequentNudity: "Frontal nudity",
		},
		sexScenes: {
			name: "Sex scenes",
			definition:
				"Consensual sexual activity on screen (oral, penetrative, etc).",
			someSexScenes: "Occasional or censored sex scenes",
			frequentSexScenes: "Frequent or graphic sex scenes",
		},
		sexualViolence: {
			name: "Sexual violence",
			definition:
				"Non-consensual sexual activity on screen (rape, assault, sexual touching/contact, harrassment, exploitation, exposure).",
			someSexualViolence: "Sexual violence excluding rape",
			frequentSexualViolence: "Graphic sexual violence or rape",
		},
		suggestiveContent: {
			name: "Suggestive content",
			definition:
				"Mild provocative sexual references or materials such as innuendos, sexual remarks, lingerie, or sex toys.",
			someSuggestiveContent: "Some suggestive content",
			frequentSuggestiveContent: "Frequent suggestive content",
		},
		violence: {
			name: "Violence",
			definition:
				"Any sort of physical force against other characters, including cartoon violence.  Other content warnings determine how graphic it is.",
			someViolence: "Depictions of violence",
			frequentViolence: "Frequent depictions of violence",
		},
		gore: {
			name: "Gore",
			definition:
				"Injuries include not just blood but rendered flesh, exposure of organs and/or bones, or bloody dismemberment. This includes cartoony depictions.",
			someGore: "Occasional gore",
			frequentGore: "Frequent gore",
		},
		blood: {
			name: "Blood",
			definition:
				"Injuries bleed but no gore is depicted. This includes cartoony blood or non-human blood that isn't red.",
			someBlood: "Mild/cartoony blood depictions",
			frequentBlood: "Gratuitous blood depictions",
		},
		deathAndSuicide: {
			name: "Death and suicide",
			definition: "Death of characters enters the plot at all.",
			someDeathAndSuicide: "Deaths and/or suicides occur",
			frequentDeathAndSuicide:
				"Frequent, intense, or traumatic death and/or suicide",
		},
		sexualLanguage: {
			name: "Sexual language",
			definition:
				"Characters describing sexually explicit things, like what they're going to do in a sex scene.",
			someSexualLanguage: "Sexual language",
			frequentSexualLanguage: "Frequent/graphic sexual language",
		},
		swearing: {
			name: "Swearing",
			definition:
				"Explitives. 'Explicit' means intense or frequent use of profanity such as the F-word, MFer, etc. Moderate denotes that any profanity is used at all.",
			someSwearing: "Moderate profanity",
			frequentSwearing: "Explicit profanity",
		},
		slurs: {
			name: "Slurs",
			definition:
				"Offensive and derogatory terms to describe a person due to intrinsic traits such as their race, sexuality, or gender.",
			someSlurs: "Occasional use of slurs",
			frequentSlurs: "Frequent or intense use of slurs",
		},
		abusiveLanguage: {
			name: "Emotional Abuse",
			definition:
				"One or more characters humiliate, insult, manipulate and/or generally instill fear and insecurity in another character as part of an abusive character dynamic.",
			someAbusiveLanguage: "Some emotional abuse",
			frequentAbusiveLanguage: "Extreme or recurring emotional abuse",
		},
		hardDrugUse: {
			name: "Hard drug use",
			definition:
				"Use of any illicit substance where addiction or fatal overdose poses a risk to be taken seriously. For instance: cocaine, opiates, meth.",
			someHardDrugUse: "Occasional hard drugs",
			frequentHardDrugUse: "Frequent hard drug use or abuse",
		},
		commonDrugUse: {
			name: "Soft drug use",
			definition:
				"Use of illicit substances that are not associated with potential overdose or addiction. For instance: marijuana, mushrooms, LSD.",
			someCommonDrugUse: "Occasional drug use",
			frequentCommonDrugUse: "Frequent drug use",
		},
		alcoholUse: {
			name: "Alcohol use",
			definition:
				"Use of alcohol of any nature, from beer and wine to hard liquor. Depictions of drunk characters.",
			someAlcoholUse: "Some alcohol use",
			frequentAlcoholUse: "Freqeuent alcohol use or abuse",
		},
		referencesToSubstances: {
			name: "Drug or alcohol references",
			definition:
				"Content does not depict their use, but does show references to drugs and/or alcohol, such as in dialog or in-world advertisements.",
			someReferencesToSubstances: "Occasional substance references",
			frequentReferencesToSubstances: "Frequent substance references",
		},
	},
	genres: {
		title: "Genres",
		Action: "Action",
		Adventure: "Adventure",
		Comedy: "Comedy",
		Drama: "Drama",
		Fantasy: "Fantasy",
		Horror: "Horror",
		Mystery: "Mystery",
		Romance: "Romance",
		"Sci-Fi": "Science Fiction",
		"Slice of Life": "Slice of Life",
		Superhero: "Superhero",
		Thriller: "Thriller",
		Historical: "Historical",
		Western: "Western",
		Noir: "Noir",
		Dystopian: "Dystopian",
		Mecha: "Mecha",
		"Magical Girl": "Magical Girl",
		Pokemon: "Pokemon",
		Fandom: "Fandom",
	},
};

export default english