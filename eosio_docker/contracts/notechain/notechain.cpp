#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
using namespace eosio;

// Smart Contract Name: notechain
// Table struct:
//   notestruct: multi index table to store the notes
//     prim_key(uint64): primary key
//     user(account_name/uint64): account name for the user
//     note(string): the note message
//     timestamp(uint64): the store the last update block time
// Public method:
//   isnewuser => to check if the given account name has note in table or not
// Public actions:
//   update => put the note into the multi-index table and sign by the given account

// Replace the contract class name when you start your own project
class notechain : public eosio::contract {
  private:
    bool isnewuser( account_name user ) {
      notetable noteobj(_self, _self);
      // get object by secordary key
      auto notes = noteobj.get_index<N(getbyuser)>();
      auto note = notes.find(user);

      return note == notes.end();
    }

    /// @abi table
    struct notestruct {
      uint64_t      prim_key;  // primary key
      account_name  user;      // account name for the user
      std::string   note;      // the note message
      uint64_t      timestamp; // the store the last update block time

      // primary key
      auto primary_key() const { return prim_key; }
      // secondary key: user
      account_name get_by_user() const { return user; }
    };

    // create a multi-index table and support secondary key
    typedef eosio::multi_index< N(notestruct), notestruct,
      indexed_by< N(getbyuser), const_mem_fun<notestruct, account_name, &notestruct::get_by_user> >
      > notetable;

  public:
    using contract::contract;

    /// @abi action
    void update( account_name _user, std::string& _note ) {
      // to sign the action with the given account
      require_auth( _user );

      notetable obj(_self, _self); // code, scope

      // create new / update note depends whether the user account exist or not
      if (isnewuser(_user)) {
        // insert object
        obj.emplace( _self, [&]( auto& address ) {
          address.prim_key    = obj.available_primary_key();
          address.user        = _user;
          address.note        = _note;
          address.timestamp   = now();
        });
      } else {
        // get object by secordary key
        auto notes = obj.get_index<N(getbyuser)>();
        auto &note = notes.get(_user);
        // update object
        obj.modify( note, _self, [&]( auto& address ) {
          address.note        = _note;
          address.timestamp   = now();
        });
      }
    }

};

// specify the contract name, and export a public action: update
EOSIO_ABI( notechain, (update) )
