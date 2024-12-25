const knex = require('../database/knex')

class NotesController{
    async create(request, response){

      const  {title, descriptions, tags, links} = request.body
      const  user_id = request.user.id

      const [notes_id] = await knex("notes").insert({
        title,
        descriptions,
        user_id
      })

      const linksInsert = links.map(link => {

        return {
          
          notes_id,
          url : link
        }
        
      })

      await knex("links").insert(linksInsert)

      const tagsInsert = links.map(name => {

        return {
          
          notes_id,
          name,
          user_id

        }
       
      })

      await knex("tags").insert(tagsInsert)

    response.json()
    }

    async show(request, response) {
      const {id} = request.params
      const note = await knex('notes').where({id}).first()

      const tags = await knex("tags").where({notes_id: id}).orderBy("name")
      const links = await knex("links").where({notes_id: id}).orderBy("created_at")

      return response.json(
        {...
          note,
          tags,
          links

        })
    }

    async delete(request, response){
      const {id} = request.params

      await knex("notes").where({id}).delete()

      return response.json()
    }

    async index(request, response){
      const { title, tags} = request.query

      const user_id= request.user.id
      
      
      let notes

      if(tags){

        const filterTags = tags.split(',').map(tag => tag.trim())
        notes = await knex('tags')
        .select([
          "notes.id",
          "notes.title",
          "notes.user_id",
        ])
        .whereIn("name", filterTags)
        .where("notes.user_id",user_id)
        .whereLike("notes.title", `%${title}%`)
        .innerJoin("notes", "notes.id", "tags.notes_id")
        .orderBy("notes.title")

      }else{

        notes = await knex("notes")
        .where({user_id})
        .whereLike("title", `%${title}%`)
        .orderBy("title")

      }

        const userTags = await knex("tags").where({user_id})
        const notesWithTags = notes.map(note => {
          const noteTags = userTags.filter(tag=> tag.note_id === note.id)
          return {
            ...note,
            tags:noteTags
          }
        })
      
      return response.json(notesWithTags)

    }
}

module.exports = NotesController