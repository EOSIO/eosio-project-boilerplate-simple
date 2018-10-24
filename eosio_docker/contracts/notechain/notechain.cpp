#include <eosiolib/eosio.hpp>

using namespace eosio;

// Smart Contract Name: notechain
// Table struct:
//   notestruct: multi index table to store the notes
//     prim_key(uint64): primary key
//     user(capi_name/uint64): account name for the user
//     note(string): the note message
//     timestamp(uint64): the store the last update block time
// Public method:
//   isnewuser => to check if the given account name has note in table or not
// Public actions:
//   update => put the note into the multi-index table and sign by the given account

// Replace the contract class name when you start your own project
CONTRACT notechain : public eosio::contract {
  private:
    bool isnewuser( capi_name user ) {
      // get notes by using secordary key
      auto note_index = _notes.get_index<name("getbyuser")>();
      auto note_iterator = note_index.find(user);

      return note_iterator == note_index.end();
    }

    TABLE notestruct {
      uint64_t      prim_key;  // primary key
      capi_name     user;      // account name for the user
      std::string   note;      // the note message
      uint64_t      timestamp; // the store the last update block time

      // primary key
      auto primary_key() const { return prim_key; }
      // secondary key: user
      capi_name get_by_user() const { return user; }
    };

    // create a multi-index table and support secondary key
    typedef eosio::multi_index< name("notestruct"), notestruct,
      indexed_by< name("getbyuser"), const_mem_fun<notestruct, capi_name, &notestruct::get_by_user> >
      > note_table;

    note_table _notes;

  public:
    using contract::contract;

    // constructor
    notechain( name receiver, name code, datastream<const char*> ds ):
                contract( receiver, code, ds ),
                _notes( receiver, receiver.value ) {}

    ACTION update( capi_name username, std::string& note ) {
      // to sign the action with the given account
      require_auth( username );

      // create new / update note depends whether the user account exist or not
      if (isnewuser(username)) {
        // insert new note
        _notes.emplace( _self, [&]( auto& new_user ) {
          new_user.prim_key    = _notes.available_primary_key();
          new_user.user        = username;
          new_user.note        = note;
          new_user.timestamp   = now();
        });
      } else {
        // get object by secordary key
        auto note_index = _notes.get_index<name("getbyuser")>();
        auto &note_entry = note_index.get(username);
        // update existing note
        _notes.modify( note_entry, _self, [&]( auto& modified_user ) {
          modified_user.note      = note;
          modified_user.timestamp = now();
        });
      }
    }

};

// specify the contract name, and export a public action: update
EOSIO_DISPATCH( notechain, (update) )
