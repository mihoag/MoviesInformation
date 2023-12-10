require('dotenv').config();
const pgp = require('pg-promise')({
    capSQL: true
});
const fs = require('fs')
const cn = {
    host: "b5ot9o2gudipfsqhuwop-postgresql.services.clever-cloud.com",
    port: "50013",
    database: "b5ot9o2gudipfsqhuwop",
    user: "unzygfgpiv3obikqdo4y",
    password: "nSp9cwbxeLrGfdJfiBXJpj7iggjMPR",
    // max: 30 // use up to 30 connections
};

console.log(process.env.HOST)
console.log(process.env.PORT)
console.log(process.env.DATABASE)
console.log(process.env.USER)
console.log(process.env.PASSWORD)


const createTableSql = `
CREATE TABLE IF NOT EXISTS movies (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    fullTitle VARCHAR(255),
    year INTEGER,
    image VARCHAR(255),
    releaseDate VARCHAR(255),
    plot TEXT,
    genreList TEXT[],
    imDbrating FLOAT,
    boxOffice FLOAT,
    isFav BOOLEAN -- New column for favorite status
  );
  
  
  CREATE TABLE IF NOT EXISTS names (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    role VARCHAR(255),
    image VARCHAR(255),
    summary TEXT,
    birthday VARCHAR(255),
    deathDate VARCHAR(255),
    castMovies TEXT[] -- New column for an array of strings
  );
  
  
  CREATE TABLE IF NOT EXISTS reviews (
    movieId VARCHAR(255),
    username VARCHAR(255),
    date VARCHAR(255),
    rate FLOAT,
    title VARCHAR(255),
    content TEXT,
    PRIMARY KEY (movieId, username),
    FOREIGN KEY (movieId) REFERENCES movies(id)
  );
  
  
  CREATE TABLE IF NOT EXISTS actorListperMovie (
    movieId VARCHAR(255),
    actorId VARCHAR(255),
    asCharacter VARCHAR(255),
    PRIMARY KEY (movieId, actorId),
    FOREIGN KEY (movieId) REFERENCES movies(id)
  );
`

const insertMovieSql = "insert into movies values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)"
const insertReviewSql = "insert into reviews values ($1,$2,$3,$4,$5,$6)"
const insertActorSql = "insert into names values ($1,$2,$3,$4,$5,$6,$7,$8)";
const insertActorListPerMovieSql = "insert into actorListperMovie values ($1,$2,$3)";

var db = pgp(cn);

// Kiểm tra và tạo database nếu chưa tồn tại
// Kiểm tra và tạo database nếu chưa tồn tại
async function createDatabaseIfNotExists() {
    try {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.any('SELECT * FROM movies');
            console.log(data);
            return data;
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    } catch (error) {
        console.error('Error creating database:', error);
    }
}


//createDatabaseIfNotExists();


async function importData() {
    //console.log(data);
    fs.readFile('../data/data.json', 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
        }
        // Parse the JSON data
        const jsonData = JSON.parse(data);
        // console.log(jsonData.Movies[0].actorList);
        // thuc hien import movies
        let movies = jsonData.Movies;
        for (let i = 0; i < movies.length; i++) {
            try {
                await db.none(insertMovieSql, [movies[i].id, movies[i].title, movies[i].fullTitle,
                parseInt(movies[i].year), movies[i].image, movies[i].releaseDate, movies[i].plot,
                movies[i].genreList, parseFloat(movies[i].imDbRating),
                parseFloat(movies[i].boxOffice.substring(1).replace(/,/g, '')), false]);
            } catch (error) {
                //console.log(error);
            }
        }

        // Import du lieu actor
        let actors = jsonData.Names;
        for (let i = 0; i < actors.length; i++) {
            try {
                await db.none(insertActorSql, [actors[i].id, actors[i].name, actors[i].role,
                actors[i].image, actors[i].summary, actors[i].birthday, actors[i].deathDate,
                actors[i].castMovies]);
            } catch (error) {
                console.log(error);
            }
        }

        // import du lieu reviews 
        let reviews = jsonData.Reviews;
        for (let i = 0; i < reviews.length; i++) {
            let items = reviews[i].items;
            for (let j = 0; j < items.length; j++) {
                try {
                    await db.none(insertReviewSql, [reviews[i].movieId, items[j].username, items[j].date,
                    parseFloat(items[j].rate), items[j].title, items[j].content]);
                } catch (error) {
                    console.log(error);
                }
            }
        }

        // import du lieu actorListPermovie

        for (let i = 0; i < movies.length; i++) {
            let actorList = movies[i].actorList;
            for (let j = 0; j < actorList.length; j++) {
                try {
                    await db.none(insertActorListPerMovieSql, [movies[i].id, actorList[j].id, actorList[j].asCharacter]);
                } catch (error) {
                    //console.log(error);
                }
            }
        }
        console.log('Import data successfully!!');
    });
}
//importData();

module.exports = {
    getAll: async (tbName) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.any('SELECT * FROM ' + tbName);
            // console.log(data);
            return data;
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    },

    insert: async (tbName, entity) => {
        const query = pgp.helpers.insert(entity, null, tbName);
        console.log(query);
        await db.none(query);
    },


    getById: async (tbName, nameId, valueId) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.any(`SELECT * FROM ${tbName} where ${nameId} = $1`, [valueId]);
            // console.log(data);
            return data;
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    },

    // select top from table by fieldname
    selectTop: async (tbName, fieldName, limit) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.any(`SELECT * FROM ${tbName} where ${fieldName} != 'NaN'  ORDER BY  ${fieldName} desc LIMIT $1`, [limit]);
            // console.log(data);
            return data;
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    },
    selectTopFav: async (tbName, fieldName, limit) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.any(`SELECT * FROM ${tbName} where isFav = 'true'  ORDER BY  ${fieldName} desc LIMIT $1`, [limit]);
            // console.log(data);
            return data;
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    }
    ,
    selectAllFavMovies: async (tbName) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.any(`SELECT * FROM ${tbName} where isFav = 'true'`);
            console.log(data);
            return data;
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    },
    deleteFavMovie: async (tbName, id) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            await dbcn.none(`update ${tbName} set isFav = 'false'  where id = $1`, [id]);
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    },
    insertFavMovie:
        async (tbName, id) => {
            let dbcn = null;
            try {
                dbcn = await db.connect();
                await dbcn.none(`update ${tbName} set isFav = 'true'  where id = $1`, [id]);
            } catch (error) {
                throw error;
            }
            finally {
                dbcn.done();
            }
        }
    ,
    getListActorByMovieId: async (id) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.any(`select m.id, a.actorid , n.name from movies m ,
            actorlistpermovie a, names n  where a.movieid = m.id and a.actorid = n.id and  m.id = $1`, [id]);
            //  console.log(data);
            return data;
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    },
    getListFilmByActorId: async (id) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.any(`select m.title,  m.id, a.actorid , n.name from movies m ,
            actorlistpermovie a, names n  where a.movieid = m.id and a.actorid = n.id and a.actorid = $1`, [id]);
            //  console.log(data);
            return data;
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    },
    searchByKeyword: async (tbName, fieldname, keyword) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.any(`select * from ${tbName} where ${fieldname} like $1`, [`%${keyword}%`]);
            return data;
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    }
}



