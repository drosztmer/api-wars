
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS pk_users_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.planet_votes DROP CONSTRAINT IF EXISTS pk_planet_votes_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.planet_votes DROP CONSTRAINT IF EXISTS fk_users_id CASCADE;

DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.users_id_seq;
CREATE TABLE users (
    id serial NOT NULL,
    username text,
    password text
);

DROP TABLE IF EXISTS public.planet_votes;
DROP SEQUENCE IF EXISTS public.planet_votes_id_seq;
CREATE TABLE planet_votes (
    id serial NOT NULL,
    planet_id integer,
    planet_name text,
    user_id integer,
    submission_time timestamp without time zone
);


ALTER TABLE ONLY planet_votes
    ADD CONSTRAINT pk_planet_votes_id PRIMARY KEY (id);

ALTER TABLE ONLY users
    ADD CONSTRAINT pk_users_id PRIMARY KEY (id);

ALTER TABLE ONLY planet_votes
    ADD CONSTRAINT fk_users_id FOREIGN KEY (user_id) REFERENCES users(id);


INSERT INTO users VALUES (0, 'vader', 'password');
INSERT INTO users VALUES (1, 'bobafett', 'password2');
INSERT INTO users VALUES (2, 'jabba', 'password3');

SELECT pg_catalog.setval('users_id_seq', 2, true);

INSERT INTO planet_votes VALUES (0, 1, 'Tatooine', 1, '2017-04-28 16:49:00');
INSERT INTO planet_votes VALUES (1, 2, 'Alderaan', 2, '2017-05-02 16:55:00');
SELECT pg_catalog.setval('planet_votes_id_seq', 2, true);
