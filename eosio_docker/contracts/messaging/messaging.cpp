#include <eosiolib/eosio.hpp>
#include <eosiolib/transaction.hpp>
#include <eosiolib/crypto.h>
#include <string>
#include <vector>

using eosio::indexed_by;
using eosio::const_mem_fun;
using std::string;
using eosio::print;
using std::vector;
using eosio::permission_level;
using eosio::action;

class messaging : public eosio::contract {

    public:

    explicit messaging( action_name self )
            : contract( self ) {
    }

    //@abi action
    void registerkey(uint64_t id, account_name who, string publickey) {

      require_auth( who ); // make sure authorized by account

      keys_indexed keys( who, _self ); // code, scope

      auto itr = keys.find( id );

      if( itr != keys.end() ) {
         std::string err = "Key id is already in use: " + std::to_string(id);
         eosio_assert( false, err.c_str() );
      }

       keys.emplace( who, [&]( auto& item ) {
          item.id = id;
          item.who = who;
          item.publickey = publickey;
       });
     
    }

    //@abi action
    void newrequest(uint64_t id, account_name sender, account_name recipient) {

       //  require_auth( sender ); // make sure authorized by account

      requests_indexed requests( sender, recipient ); // code, scope

      auto itr = requests.find( id );

      if( itr != requests.end() ) {
         std::string err = "Request id is already in use: " + std::to_string(id);
         eosio_assert( false, err.c_str() );
      }

      requests.emplace( sender, [&]( auto& item ) {
         item.id = id;
         item.recipient = recipient;
         item.time_requested = now();
         item.sender = sender;
      });

    }

    //@abi action
    void registerseed(uint64_t id, account_name sender, account_name recipient, string seed) {

      require_auth( sender ); // make sure authorized by account

      phonebook_indexed books( sender, _self ); // code, scope

      auto itr = books.find( id );

      if( itr != books.end() ) {
         std::string err = "Book id is already in use: " + std::to_string(id);
         eosio_assert( false, err.c_str() );
      }

      books.emplace( sender, [&]( auto& item ) {
         item.id = id;
         item.sender = sender;
         item.recipient = recipient;
         item.seed = seed;
      });

    } 

   private:

   //@abi table requests i64
   struct requests {

      uint64_t id;
      account_name recipient;
      uint64_t time_requested;
      account_name sender;

      uint64_t primary_key() const { return id; }

      account_name by_recipient() const { return recipient; } //getter for recipient

      uint64_t by_time_requested() const { return time_requested; }

      account_name by_sender() const { return sender; }

      EOSLIB_SERIALIZE(requests, ( id )( recipient )( time_requested )( sender ));

   };

   //@abi table phonebook i64
   struct phonebook {

      uint64_t id;
      account_name sender;
      account_name recipient;
      string seed;

      uint64_t primary_key() const { return id; }

      account_name by_sender() const { return sender; }

      account_name by_recipient() const { return recipient; }

      string by_seed() const { return seed; }

      EOSLIB_SERIALIZE(phonebook, ( id )( sender )( recipient )( seed ));

   };

   //@abi table keys i64
   struct keys {

      uint64_t id;
      account_name who;
      string publickey;

      uint64_t primary_key() const { return id; }

      account_name by_who() const { return who; }

      string by_public_key() const { return publickey; }

      EOSLIB_SERIALIZE(keys, ( id )( who )( publickey ));

   };

   typedef eosio::multi_index<N( requests ), requests,
         indexed_by<N( byRecipient ), const_mem_fun<requests, account_name, &requests::by_recipient> >,
         indexed_by<N( byTimeRequested ), const_mem_fun<requests, uint64_t, &requests::by_time_requested> >,
         indexed_by<N( bySender ), const_mem_fun<requests, account_name, &requests::by_sender> >
   > requests_indexed;

   typedef eosio::multi_index<N( phonebook ), phonebook,
         indexed_by<N( bySender ), const_mem_fun<phonebook, account_name, &phonebook::by_sender> >,
         indexed_by<N( byRecipient ), const_mem_fun<phonebook, account_name, &phonebook::by_recipient> >
   > phonebook_indexed;

   typedef eosio::multi_index<N( keys ), keys,
         indexed_by<N( byWho ), const_mem_fun<keys, account_name, &keys::by_who> >
   > keys_indexed;
  
};

EOSIO_ABI( messaging, ( registerkey )( newrequest )( registerseed ))