#CMG Application

##feature_1
Base application layout. Include libraries. Home Page & Offcanvas

##feature_2
search_club: list of clubs, searchable

##feature_3
club: details

##feature_4
activité: details

##feature_5
activité: liste/search

##feature_6
activité: horaires


##feature_7
recherhe + abonnement + news

##feature_8
basic archi in JS

Possible routes:

/clubs    clubs_controller#index
/clubs/:id      clubs_controller#show
/clubs/:id/schedule   clubs_controller#schedule
/clubs/:id/activities   clubs_controller#activities

/activities    activities_controller#index
/activities/:id         activities_controller#show
/activities/:id/schedule    activities_controller#schedule

/search    application_controller#search
/home    application_controller#home
/subscriptions     application_controller#subscriptions


/news  news_controller#index
/news/:id  news_controller#show

